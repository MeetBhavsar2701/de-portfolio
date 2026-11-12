import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

const PACKET_COUNT = 120;

export function PipelineWorld() {
  const cyanInstancedRef = useRef<THREE.InstancedMesh>(null);
  const amberInstancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Multi-lane packet stream along the pipeline (X: -30 to 360)
  const packetData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PACKET_COUNT; i++) {
      data.push({
        x: -30 + (i / PACKET_COUNT) * 390,
        speed: 14 + (i % 5) * 2.5,
        lane: (i % 2 === 0 ? -1 : 1) * 0.45,
        elevation: 0.45 + (i % 3) * 0.1,
        isAmber: i % 3 === 0,
      });
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    let cyanIdx = 0;
    let amberIdx = 0;

    for (let i = 0; i < PACKET_COUNT; i++) {
      const p = packetData[i];
      p.x += p.speed * delta;
      if (p.x > 360) {
        p.x = -30;
      }

      dummy.position.set(p.x, p.elevation, p.lane);
      dummy.rotation.x += delta * 3;
      dummy.rotation.y += delta * 4;
      dummy.scale.set(0.28, 0.28, 0.28);
      dummy.updateMatrix();

      if (p.isAmber && amberInstancedRef.current) {
        amberInstancedRef.current.setMatrixAt(amberIdx++, dummy.matrix);
      } else if (cyanInstancedRef.current) {
        cyanInstancedRef.current.setMatrixAt(cyanIdx++, dummy.matrix);
      }
    }

    if (cyanInstancedRef.current) cyanInstancedRef.current.instanceMatrix.needsUpdate = true;
    if (amberInstancedRef.current) amberInstancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Ground Physics Surface */}
      <RigidBody type="fixed" friction={1.5} restitution={0.05}>
        <CuboidCollider args={[220, 0.5, 35]} position={[165, -0.5, 0]} />
        {/* Invisible Boundary Walls */}
        <CuboidCollider args={[220, 6, 0.5]} position={[165, 3, 30]} />
        <CuboidCollider args={[220, 6, 0.5]} position={[165, 3, -30]} />
        <CuboidCollider args={[0.5, 6, 35]} position={[-45, 3, 0]} />
        <CuboidCollider args={[0.5, 6, 35]} position={[375, 3, 0]} />
      </RigidBody>

      {/* Visual Ground Plane */}
      <mesh position={[165, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[440, 65]} />
        <meshStandardMaterial color="#030712" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Glowing Tech Grid */}
      <Grid
        position={[165, 0.01, 0]}
        args={[440, 65]}
        cellSize={2}
        cellThickness={1}
        cellColor="#0284c7"
        sectionSize={10}
        sectionThickness={1.5}
        sectionColor="#38bdf8"
        fadeDistance={90}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Central Pipeline Glowing Rails (Dual tracks running along X axis) */}
      <mesh position={[165, 0.15, -0.45]}>
        <boxGeometry args={[420, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[165, 0.15, 0.45]}>
        <boxGeometry args={[420, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Pipeline Support Bed */}
      <mesh position={[165, 0.04, 0]}>
        <boxGeometry args={[420, 0.08, 1.4]} />
        <meshStandardMaterial color="#0b172a" roughness={0.6} metalness={0.6} />
      </mesh>

      {/* Neon Edge Guide Strips on Perimeter */}
      <mesh position={[165, 0.05, 29]}>
        <boxGeometry args={[420, 0.1, 0.2]} />
        <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[165, 0.05, -29]}>
        <boxGeometry args={[420, 0.1, 0.2]} />
        <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={1.2} />
      </mesh>

      {/* Instanced Glowing Data Packets */}
      <instancedMesh ref={cyanInstancedRef} args={[undefined, undefined, PACKET_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f0ff"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={amberInstancedRef} args={[undefined, undefined, PACKET_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
