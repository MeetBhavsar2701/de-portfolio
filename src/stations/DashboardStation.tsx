import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PROFILE } from '../content/profile';

export function DashboardStation() {
  const barsGroupRef = useRef<THREE.Group>(null);
  const donutMeshRef = useRef<THREE.Mesh>(null);

  // Animated bar values
  const barData = useMemo(
    () => [
      { height: 1.8, speed: 2.1 },
      { height: 2.5, speed: 1.7 },
      { height: 1.2, speed: 2.8 },
      { height: 2.8, speed: 1.4 },
      { height: 2.0, speed: 2.3 },
    ],
    []
  );

  useFrame((state, delta) => {
    if (barsGroupRef.current) {
      barsGroupRef.current.children.forEach((bar, idx) => {
        const item = barData[idx];
        if (item) {
          const osc = 0.8 + Math.sin(state.clock.elapsedTime * item.speed) * 0.4;
          bar.scale.y = osc;
        }
      });
    }

    if (donutMeshRef.current) {
      donutMeshRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group position={[240, 0, 0]}>
      {/* Wall of Dashboard Telemetry Screens */}
      <mesh position={[0, 2.5, -4.5]}>
        <boxGeometry args={[11, 4.8, 0.4]} />
        <meshStandardMaterial color="#0b1329" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen Frame Bevel */}
      <mesh position={[0, 2.5, -4.2]}>
        <boxGeometry args={[10.6, 4.4, 0.1]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Screen 1: Animated Bar Chart Graphic */}
      <group position={[-3.2, 2.4, -4.1]}>
        <Text position={[0, 1.4, 0]} fontSize={0.28} color="#38bdf8" anchorX="center">
          PIPELINE LATENCY (ms)
        </Text>
        <group ref={barsGroupRef} position={[-1.2, -0.6, 0]}>
          {barData.map((b, i) => (
            <mesh key={i} position={[i * 0.6, b.height / 2, 0]}>
              <boxGeometry args={[0.35, b.height, 0.08]} />
              <meshStandardMaterial
                color="#00f0ff"
                emissive="#00f0ff"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Screen 2: Animated Ring Donut Gauge */}
      <group position={[3.2, 2.4, -4.1]}>
        <Text position={[0, 1.4, 0]} fontSize={0.28} color="#38bdf8" anchorX="center">
          SLA COMPLIANCE: 99.9%
        </Text>
        <mesh ref={donutMeshRef} position={[0, 0.2, 0]}>
          <torusGeometry args={[0.85, 0.18, 16, 48]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* Foreground Achievements Billboard */}
      <group position={[0, 1.8, 1.5]}>
        <mesh>
          <boxGeometry args={[8.5, 3.2, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <Text position={[0, 1.1, 0.1]} fontSize={0.4} color="#f59e0b" anchorX="center">
          CERTIFICATES & ACHIEVEMENTS
        </Text>
        {PROFILE.achievements.map((ach, i) => (
          <Text
            key={i}
            position={[0, 0.4 - i * 0.6, 0.1]}
            fontSize={0.26}
            color="#f8fafc"
            anchorX="center"
            maxWidth={7.8}
          >
            {`🏆 ${ach}`}
          </Text>
        ))}
      </group>
    </group>
  );
}

