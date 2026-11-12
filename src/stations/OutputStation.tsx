import React from 'react';
import { Text, Html } from '@react-three/drei';
import { PROFILE } from '../content/profile';

export function OutputStation() {
  return (
    <group position={[300, 0, 0]}>
      {/* Monumental API Gateway Portal Arch */}
      <group position={[0, 0, -4]}>
        {/* Arch Columns */}
        <mesh position={[-4, 3, 0]}>
          <boxGeometry args={[0.8, 6, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[4, 3, 0]}>
          <boxGeometry args={[0.8, 6, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Crown beam */}
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[8.8, 0.6, 1.0]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={1} />
        </mesh>
        {/* Holographic API Destination Field */}
        <mesh position={[0, 3, 0]}>
          <planeGeometry args={[7.2, 5.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.3}
          />
        </mesh>
        <Text position={[0, 5.4, 0.5]} fontSize={0.5} color="#38bdf8" anchorX="center">
          OUTPUT API GATEWAY
        </Text>
      </group>

      {/* Floating Contact & Resume Actions Board */}
      <group position={[0, 2.2, 1.5]}>
        <mesh>
          <boxGeometry args={[8.2, 3.6, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        <Text position={[0, 1.3, 0.1]} fontSize={0.4} color="#38bdf8" anchorX="center">
          Ready to Deliver Value to Your Data Stack!
        </Text>
        <Text position={[0, 0.8, 0.1]} fontSize={0.25} color="#94a3b8" anchorX="center">
          {`Location: ${PROFILE.cityCountry} • Email: ${PROFILE.email}`}
        </Text>

        <Html position={[0, 0.05, 0.15]} center distanceFactor={14}>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              GitHub ↗
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              LinkedIn ↗
            </a>
            <a
              href={`${import.meta.env.BASE_URL || '/'}resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)',
              }}
            >
              Download Resume (PDF) ↓
            </a>
          </div>
        </Html>

        <Text position={[0, -1.2, 0.1]} fontSize={0.22} color="#64748b" anchorX="center">
          Thank you for visiting my 3D data pipeline portfolio!
        </Text>
      </group>
    </group>
  );
}

