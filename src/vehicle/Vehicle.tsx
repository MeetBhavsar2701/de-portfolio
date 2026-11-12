import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { VEHICLE_CONFIG } from './config';
import { useInput } from '../lib/useInput';
import { useStore } from '../lib/store';

export function Vehicle() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const input = useInput();
  const lastCheckpoint = useStore((state) => state.lastCheckpoint);
  const teleportTarget = useStore((state) => state.teleportTarget);
  const requestTeleport = useStore((state) => state.requestTeleport);

  const upsideDownTimer = useRef<number>(0);
  const yawAngle = useRef<number>(0);

  // Core pulse animation
  const coreMeshRef = useRef<THREE.Mesh>(null);

  // Helper respawn
  const respawn = (targetPos?: [number, number, number]) => {
    if (!rigidBodyRef.current) return;
    const dest = targetPos || lastCheckpoint;
    rigidBodyRef.current.setTranslation({ x: dest[0], y: dest[1] + 1.0, z: dest[2] }, true);
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    yawAngle.current = 0;
    upsideDownTimer.current = 0;
  };

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    // Cache mesh on window for E2E hooks
    if (typeof window !== 'undefined') {
      const parentObj = state.scene.getObjectByName('vehicle');
      if (parentObj) {
        (window as any).__vehicleMesh = parentObj;
      }
    }

    // Handle teleport requests from HUD/test hooks
    if (teleportTarget) {
      respawn(teleportTarget);
      requestTeleport(null);
      return;
    }

    // Manual Reset (R key)
    if (input.current.reset) {
      respawn();
      return;
    }

    const pos = rigidBodyRef.current.translation();
    const linvel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();

    // Check bounds / fallen off
    if (
      pos.y < VEHICLE_CONFIG.respawnY ||
      pos.x < VEHICLE_CONFIG.worldMinX ||
      pos.x > VEHICLE_CONFIG.worldMaxX ||
      Math.abs(pos.z) > VEHICLE_CONFIG.worldZBound
    ) {
      respawn();
      return;
    }

    // Calculate forward and right vectors based on current rotation
    const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);

    // Auto-righting: check if tilted or upside down
    if (up.y < Math.cos(VEHICLE_CONFIG.autoRightAngleThreshold)) {
      upsideDownTimer.current += delta;
      if (upsideDownTimer.current > VEHICLE_CONFIG.maxUpsideDownDuration) {
        // Apply self-righting torque
        rigidBodyRef.current.setRotation({ x: 0, y: rot.y, z: 0, w: rot.w }, true);
        rigidBodyRef.current.setLinvel({ x: linvel.x * 0.5, y: 1.5, z: linvel.z * 0.5 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        upsideDownTimer.current = 0;
      }
    } else {
      upsideDownTimer.current = 0;
    }

    // Driving mechanics
    const { forward: fwd, backward, left, right, brake } = input.current;

    // Steering
    let steer = 0;
    if (left) steer += 1;
    if (right) steer -= 1;

    if (steer !== 0) {
      // Rotate around up-axis
      const steerTorque = steer * VEHICLE_CONFIG.turnSpeed;
      rigidBodyRef.current.applyTorqueImpulse({ x: 0, y: steerTorque, z: 0 }, true);
    }

    // Acceleration & Reverse
    if (fwd) {
      rigidBodyRef.current.applyImpulse(
        {
          x: forward.x * VEHICLE_CONFIG.accelerationForce * delta,
          y: forward.y * VEHICLE_CONFIG.accelerationForce * delta,
          z: forward.z * VEHICLE_CONFIG.accelerationForce * delta,
        },
        true
      );
    } else if (backward) {
      rigidBodyRef.current.applyImpulse(
        {
          x: -forward.x * VEHICLE_CONFIG.reverseForce * delta,
          y: -forward.y * VEHICLE_CONFIG.reverseForce * delta,
          z: -forward.z * VEHICLE_CONFIG.reverseForce * delta,
        },
        true
      );
    }

    // Braking
    if (brake) {
      rigidBodyRef.current.setLinvel(
        {
          x: linvel.x * 0.88,
          y: linvel.y,
          z: linvel.z * 0.88,
        },
        true
      );
    }

    // Core pulsing light effect
    if (coreMeshRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 6) * 0.2;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={VEHICLE_CONFIG.mass}
      linearDamping={VEHICLE_CONFIG.linearDamping}
      angularDamping={VEHICLE_CONFIG.angularDamping}
      position={[0, 1.2, 5]}
      name="vehicle"
    >
      <CuboidCollider args={[0.9, 0.35, 0.6]} />

      {/* Main Vehicle Chassis - Low Poly Arcade Rover */}
      <group>
        {/* Chassis body */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.7, 0.35, 1.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Upper cabin / visor */}
        <mesh position={[0.1, 0.35, 0]} castShadow>
          <boxGeometry args={[0.9, 0.25, 0.8]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.9}
            emissive="#0369a1"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Glowing Data Packet Core */}
        <mesh ref={coreMeshRef} position={[0, 0.32, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>

        {/* Headlights (Front is +X in initial orientation or -Z depending on direction) */}
        <mesh position={[-0.85, 0.1, 0.35]}>
          <boxGeometry args={[0.05, 0.1, 0.2]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3} />
        </mesh>
        <mesh position={[-0.85, 0.1, -0.35]}>
          <boxGeometry args={[0.05, 0.1, 0.2]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3} />
        </mesh>

        {/* 4 Rugged Rover Wheels */}
        <mesh position={[0.6, -0.15, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.6, -0.15, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, -0.15, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.6, -0.15, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>
    </RigidBody>
  );
}
