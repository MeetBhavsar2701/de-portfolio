import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PROFILE } from '../content/profile';

const SPARK_COUNT = 30;

export function TransformStation() {
  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Points>(null);

  // Sparks particle positions
  const sparkData = useMemo(() => {
    const pos = new Float32Array(SPARK_COUNT * 3);
    const speeds = new Float32Array(SPARK_COUNT);
    for (let i = 0; i < SPARK_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3 - 4;
      speeds[i] = 1.5 + Math.random() * 2.5;
    }
    return { pos, speeds };
  }, []);

  useFrame((_, delta) => {
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * 1.2;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * 1.5;

    // Animate rising sparks
    if (sparksRef.current) {
      const positions = sparksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < SPARK_COUNT; i++) {
        positions[i * 3 + 1] += sparkData.speeds[i] * delta;
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = 0.5;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[120, 0, 0]}>
      {/* Transformation Forge Furnace Structure */}
      <mesh position={[0, 1.8, -4.5]} castShadow>
        <boxGeometry args={[6, 3.6, 2.5]} />
        <meshStandardMaterial color="#0b1120" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Fiery Core Chamber */}
      <mesh position={[0, 1.5, -3.2]}>
        <planeGeometry args={[4, 2.2]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Rotating Gear 1: Spark */}
      <group ref={gear1Ref} position={[-2, 4.2, -4]}>
        <mesh>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <Text position={[0, 0, 0.15]} fontSize={0.35} color="#0f172a" anchorX="center">
          SPARK
        </Text>
      </group>

      {/* Rotating Gear 2: dbt */}
      <group ref={gear2Ref} position={[2, 3.8, -4]}>
        <mesh>
          <cylinderGeometry args={[1.1, 1.1, 0.2, 10]} />
          <meshStandardMaterial color="#f97316" metalness={0.9} roughness={0.2} />
        </mesh>
        <Text position={[0, 0, 0.15]} fontSize={0.35} color="#0f172a" anchorX="center">
          dbt
        </Text>
      </group>

      {/* Rising Sparks Particles */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={SPARK_COUNT}
            array={sparkData.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#fbbf24" transparent opacity={0.8} />
      </points>

      {/* Floating Project Cards (3 Projects) */}
      <group position={[0, 1.8, 1.5]}>
        {PROFILE.projects.map((project, index) => {
          const offsetX = (index - 1) * 4.2;
          return (
            <group key={project.name} position={[offsetX, 0, 0]}>
              {/* Backing Panel */}
              <mesh>
                <boxGeometry args={[3.8, 2.6, 0.15]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} />
              </mesh>
              {/* Card Neon Trim */}
              <mesh position={[0, 0, 0.08]}>
                <ringGeometry args={[1.7, 1.75, 4]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
              </mesh>
              <Text position={[0, 0.8, 0.12]} fontSize={0.36} color="#38bdf8" anchorX="center">
                {project.name}
              </Text>
              <Text
                position={[0, 0.25, 0.12]}
                fontSize={0.2}
                color="#cbd5e1"
                anchorX="center"
                maxWidth={3.4}
              >
                {project.description}
              </Text>
              <Text
                position={[0, -0.35, 0.12]}
                fontSize={0.18}
                color="#f59e0b"
                anchorX="center"
                maxWidth={3.4}
              >
                {`[ ${project.stack} ]`}
              </Text>

              {/* Direct Link Button Anchor via Html */}
              <Html position={[0, -0.85, 0.15]} center distanceFactor={12}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                  }}
                >
                  View Code ↗
                </a>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}

