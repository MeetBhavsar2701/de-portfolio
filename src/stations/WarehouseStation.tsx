import React from 'react';
import { Text } from '@react-three/drei';
import { PROFILE } from '../content/profile';

export function WarehouseStation() {
  const exp = PROFILE.experience;

  return (
    <group position={[180, 0, 0]}>
      {/* Lakehouse Medallion Tower */}
      <group position={[0, 0, -4.5]}>
        {/* Tier 1: BRONZE LAYER (Raw Ingestion) */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[2.5, 2.7, 2.4, 32]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[2.55, 2.55, 0.15, 32]} />
          <meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={2} />
        </mesh>
        <Text position={[0, 1.2, 2.8]} fontSize={0.35} color="#f59e0b" anchorX="center">
          BRONZE: RAW INGESTION
        </Text>

        {/* Tier 2: SILVER LAYER (Cleaned & Conformed) */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <cylinderGeometry args={[2.1, 2.3, 2.4, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 5.0, 0]}>
          <cylinderGeometry args={[2.15, 2.15, 0.15, 32]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#94a3b8" emissiveIntensity={2} />
        </mesh>
        <Text position={[0, 3.8, 2.4]} fontSize={0.35} color="#e2e8f0" anchorX="center">
          SILVER: TRANSFORMED
        </Text>

        {/* Tier 3: GOLD LAYER (Aggregated Business Analytics) */}
        <mesh position={[0, 6.4, 0]} castShadow>
          <cylinderGeometry args={[1.7, 1.9, 2.4, 32]} />
          <meshStandardMaterial color="#854d0e" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[0, 7.6, 0]}>
          <cylinderGeometry args={[1.75, 1.75, 0.15, 32]} />
          <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={3} />
        </mesh>
        <Text position={[0, 6.4, 2.0]} fontSize={0.35} color="#fde047" anchorX="center">
          GOLD: AGGREGATED METRICS
        </Text>
      </group>

      {/* Experience Summary Floating Display */}
      <group position={[0, 2.2, 1.5]}>
        <mesh>
          <boxGeometry args={[7.5, 3.4, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        <Text position={[0, 1.2, 0.1]} fontSize={0.4} color="#38bdf8" anchorX="center">
          {`${exp.role} @ ${exp.org}`}
        </Text>
        <Text position={[0, 0.7, 0.1]} fontSize={0.25} color="#94a3b8" anchorX="center">
          {exp.dates}
        </Text>

        {/* Experience Bullets */}
        {exp.bullets.map((b, i) => (
          <Text
            key={i}
            position={[0, 0.1 - i * 0.55, 0.1]}
            fontSize={0.22}
            color="#e2e8f0"
            anchorX="center"
            maxWidth={7.0}
          >
            {`• ${b}`}
          </Text>
        ))}
      </group>
    </group>
  );
}

