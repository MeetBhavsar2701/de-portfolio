import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PROFILE } from '../content/profile';
import { sound } from '../audio/SoundController';

export function IngestStation() {
  const rollerGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rollerGroupRef.current) {
      rollerGroupRef.current.children.forEach((roller) => {
        roller.rotation.x += delta * 3;
      });
    }
  });

  return (
    <group position={[60, 0, 0]}>
      {/* Conveyor Belt Bed */}
      <mesh position={[0, 0.2, -2]}>
        <boxGeometry args={[12, 0.4, 2.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Conveyor Neon Guides */}
      <mesh position={[0, 0.42, -0.7]}>
        <boxGeometry args={[12, 0.05, 0.1]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.42, -3.3]}>
        <boxGeometry args={[12, 0.05, 0.1]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
      </mesh>

      {/* Conveyor Rotating Rollers */}
      <group ref={rollerGroupRef} position={[0, 0.25, -2]}>
        {[-5, -3, -1, 1, 3, 5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 2.3, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Kafka Message Ingest Billboard */}
      <group position={[0, 4, -4.5]}>
        <mesh>
          <planeGeometry args={[8, 1.8]} />
          <meshStandardMaterial color="#090d16" roughness={0.5} />
        </mesh>
        <Text position={[0, 0.35, 0.05]} fontSize={0.6} color="#38bdf8" anchorX="center">
          KAFKA INGEST TOPIC
        </Text>
        <Text position={[0, -0.3, 0.05]} fontSize={0.32} color="#94a3b8" anchorX="center">
          Bump crates to inspect partition skills
        </Text>
      </group>

      {/* Dynamic Bumpable Skill Message Crates with Sleep enabled */}
      {PROFILE.skills.map((skill, index) => {
        // Arrange crates staggered on and near the platform
        const col = index % 3;
        const row = Math.floor(index / 3);
        const posX = -3 + col * 3;
        const posZ = 1 + row * 2.2;

        return (
          <RigidBody
            key={skill}
            type="dynamic"
            position={[posX, 0.6, posZ]}
            mass={8}
            linearDamping={1.5}
            angularDamping={2.0}
            canSleep={true}
            onCollisionEnter={() => {
              sound.playBump();
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.9, 1.1]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.4}
                metalness={0.5}
                emissive="#0284c7"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Glowing Accent Border */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.64, 0.15, 1.14]} />
              <meshStandardMaterial color="#38bdf8" emissive="#00f0ff" emissiveIntensity={1.8} />
            </mesh>

            {/* Skill Label on Front Face */}
            <Text
              position={[0, 0, 0.58]}
              fontSize={0.28}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
            >
              {skill}
            </Text>
            {/* Skill Label on Back Face */}
            <Text
              position={[0, 0, -0.58]}
              rotation={[0, Math.PI, 0]}
              fontSize={0.28}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
            >
              {skill}
            </Text>
          </RigidBody>
        );
      })}
    </group>
  );
}

