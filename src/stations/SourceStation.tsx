import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PROFILE } from '../content/profile';

export function SourceStation() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Cluster of 3 Database Storage Cylinders (Relational & Source storage) */}
      <group position={[-4, 0, -3]}>
        {/* Tier 1 */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.7, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing disc separator */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[1.52, 1.52, 0.1, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
        </mesh>
        {/* Tier 2 */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.7, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[1.52, 1.52, 0.1, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
        </mesh>
        {/* Tier 3 */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.7, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <Text position={[0, 3.2, 0]} fontSize={0.4} color="#38bdf8" anchorX="center">
          OLTP_DB
        </Text>
      </group>

      {/* Second Database Cylinder */}
      <group position={[4, 0, -3]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.3, 2.0, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[1.32, 1.32, 0.15, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} />
        </mesh>
        <Text position={[0, 2.6, 0]} fontSize={0.4} color="#38bdf8" anchorX="center">
          REST_API
        </Text>
      </group>

      {/* High-tech API Gate Arch */}
      <group position={[0, 0, -4]}>
        {/* Left Pillar */}
        <mesh position={[-3, 2.5, 0]}>
          <boxGeometry args={[0.5, 5, 0.5]} />
          <meshStandardMaterial color="#0b1329" metalness={0.8} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[3, 2.5, 0]}>
          <boxGeometry args={[0.5, 5, 0.5]} />
          <meshStandardMaterial color="#0b1329" metalness={0.8} />
        </mesh>
        {/* Lintel Beam */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[6.5, 0.5, 0.6]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
        </mesh>
        {/* Gateway Scanner Field */}
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[5.5, 4.5]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Holographic Gyro Rings */}
      <group ref={ringsRef} position={[0, 3.5, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.2, 0.04, 16, 48]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Brief Floating Info Anchor */}
      <Text position={[0, 1.2, -1]} fontSize={0.45} color="#e2e8f0" anchorX="center" maxWidth={6}>
        {PROFILE.about.slice(0, 75)}...
      </Text>
    </group>
  );
}

