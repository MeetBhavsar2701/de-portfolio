import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { PipelineWorld } from './world/PipelineWorld';
import { Vehicle } from './vehicle/Vehicle';
import { FollowCamera } from './vehicle/FollowCamera';
import { StationPlatforms } from './stations/StationPlatforms';
import { HUD } from './ui/HUD';
import { useStore, STATION_COORDINATES, StationName } from './lib/store';

// Expose window.__portfolio test hooks for Playwright & diagnostics
declare global {
  interface Window {
    __portfolio?: {
      getVehiclePosition: () => [number, number, number] | null;
      getActiveStation: () => string | null;
      teleportToStation: (name: StationName) => void;
      fps: () => number;
    };
  }
}

export function App() {
  useEffect(() => {
    const isE2E =
      typeof window !== 'undefined' &&
      (window.location.search.includes('e2e=1') ||
        import.meta.env.MODE !== 'production');

    if (isE2E) {
      let frameCount = 0;
      let lastTime = performance.now();
      let currentFps = 60;

      const calcFps = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          currentFps = Math.round((frameCount * 1000) / (now - lastTime));
          frameCount = 0;
          lastTime = now;
        }
        requestAnimationFrame(calcFps);
      };
      requestAnimationFrame(calcFps);

      window.__portfolio = {
        getVehiclePosition: () => {
          const vehicle = (window as any).__vehicleMesh as THREE.Object3D | undefined;
          if (vehicle) {
            return [vehicle.position.x, vehicle.position.y, vehicle.position.z];
          }
          return null;
        },
        getActiveStation: () => {
          return useStore.getState().activeStation;
        },
        teleportToStation: (name: StationName) => {
          const coords = STATION_COORDINATES[name];
          if (coords) {
            useStore.getState().requestTeleport([coords[0], 1.5, coords[2] + 4]);
            // Also trigger station detection immediately for tests
            useStore.getState().setActiveStation(name);
          }
        },
        fps: () => currentFps,
      };
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <HUD />
      <Canvas
        camera={{ position: [0, 5, 14], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 20, 160]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} color="#94a3b8" />
        <directionalLight
          position={[40, 60, 30]}
          intensity={1.2}
          color="#e0f2fe"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#00f0ff" distance={30} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -25, 0]}>
            <PipelineWorld />
            <StationPlatforms />
            <Vehicle />
          </Physics>

          <FollowCamera />

          {/* Postprocessing Bloom and Vignette */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.7}
              luminanceSmoothing={0.3}
              intensity={1.2}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;

