import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { STATION_NAMES, STATION_COORDINATES, useStore } from '../lib/store';

export function StationPlatforms() {
  const activeStation = useStore((state) => state.activeStation);
  const setActiveStation = useStore((state) => state.setActiveStation);
  const setLastCheckpoint = useStore((state) => state.setLastCheckpoint);

  return (
    <group>
      {STATION_NAMES.map((name, index) => {
        const coords = STATION_COORDINATES[name];
        const isActive = activeStation === name;

        return (
          <group key={name} position={coords}>
            {/* Sensor Collider */}
            <RigidBody
              type="fixed"
              sensor
              onIntersectionEnter={(payload) => {
                if (payload.other.rigidBodyObject?.name === 'vehicle') {
                  setActiveStation(name);
                  setLastCheckpoint([coords[0], 1.5, coords[2] + 4]);
                }
              }}
              onIntersectionExit={(payload) => {
                if (payload.other.rigidBodyObject?.name === 'vehicle') {
                  if (useStore.getState().activeStation === name) {
                    setActiveStation(null);
                  }
                }
              }}
            >
              <CylinderCollider args={[2.5, 8]} position={[0, 1, 0]} />
            </RigidBody>

            {/* Circular Platform Disc */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <cylinderGeometry args={[7.5, 7.8, 0.1, 48]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Outer Glowing Station Ring */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[7.2, 7.5, 48]} />
              <meshStandardMaterial
                color={isActive ? '#38bdf8' : '#0284c7'}
                emissive={isActive ? '#00f0ff' : '#0369a1'}
                emissiveIntensity={isActive ? 3.5 : 1.2}
                toneMapped={false}
              />
            </mesh>

            {/* Platform Inner Concentric Rings */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[3.2, 3.4, 36]} />
              <meshStandardMaterial
                color="#0369a1"
                emissive="#0284c7"
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Station Index Number Badge */}
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.4, 32]} />
              <meshStandardMaterial color="#0369a1" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Floating 3D Text Label */}
            <Text
              position={[0, 4.2, 0]}
              fontSize={1.4}
              color={isActive ? '#38bdf8' : '#cbd5e1'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.06}
              outlineColor="#020617"
            >
              {`${index + 1}. ${name.toUpperCase()}`}
            </Text>

            {/* Subtitle Station Type */}
            <Text
              position={[0, 2.9, 0]}
              fontSize={0.65}
              color={isActive ? '#00f0ff' : '#64748b'}
              anchorX="center"
              anchorY="middle"
            >
              PIPELINE NODE
            </Text>
          </group>
        );
      })}
    </group>
  );
}
