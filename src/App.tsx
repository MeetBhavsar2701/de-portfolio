import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { PipelineWorld } from './world/PipelineWorld';
import { Vehicle } from './vehicle/Vehicle';
import { FollowCamera } from './vehicle/FollowCamera';
import { HUD } from './ui/HUD';
import { TouchControls } from './ui/TouchControls';
import { useStore, STATION_COORDINATES, StationName } from './lib/store';
import { checkWebGLAndDevice } from './lib/webglCheck';

import { CanvasErrorBoundary } from './ui/CanvasErrorBoundary';

// Lazy-load complex station set pieces
const AllStations = lazy(() =>
  import('./stations/AllStations').then((mod) => ({ default: mod.AllStations }))
);

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
  const [dpr, setDpr] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
      return isMobile ? 1.5 : 2;
    }
    return 1.5;
  });

  const [enableBloom, setEnableBloom] = useState(true);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const check = checkWebGLAndDevice();
    if (!check.ok) {
      setWebglError(check.reason || 'Hardware acceleration unavailable');
      // Automatic fallback redirect after brief notice
      setTimeout(() => {
        window.location.href = '/resume/';
      }, 2500);
    }
  }, []);

  useEffect(() => {
    const isE2E =
      typeof window !== 'undefined' &&
      (window.location.search.includes('e2e=1') ||
        import.meta.env.MODE !== 'production');

    if (isE2E) {
      let frameCount = 0;
      let lastFpsTime = performance.now();
      let currentFps = 60;

      const calcFps = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 500) {
          currentFps = Math.max(1, Math.round((frameCount * 1000) / (now - lastFpsTime)));
          frameCount = 0;
          lastFpsTime = now;
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
            useStore.getState().setActiveStation(name);
          }
        },
        fps: () => currentFps,
      };
    }
  }, []);

  if (webglError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#020617',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', marginBottom: '12px' }}>
          3D Hardware Acceleration Unavailable
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: '500px', lineHeight: 1.6, marginBottom: '24px' }}>
          {webglError}
        </p>
        <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>
          Redirecting you to the fast, accessible 2D resume...
        </p>
        <a
          href="/resume/"
          style={{
            background: '#0284c7',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Go to 2D Resume Now
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      <HUD />
      <TouchControls />

      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 5, 14], fov: 50 }}
          dpr={dpr}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.warn('WebGL context lost. Attempting recovery...');
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context successfully restored.');
            });
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
        >
          <color attach="background" args={['#020617']} />
          <fog attach="fog" args={['#020617', 20, 160]} />

          {/* Dynamic Performance Step-down */}
          <PerformanceMonitor
            onDecline={() => {
              setDpr((prev) => Math.max(prev * 0.8, 1.0));
              setEnableBloom(false);
            }}
          />

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
              <AllStations />
              <Vehicle />
            </Physics>

            <FollowCamera />

            {enableBloom && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.7}
                  luminanceSmoothing={0.3}
                  intensity={1.2}
                  mipmapBlur
                />
                <Vignette eskil={false} offset={0.15} darkness={0.8} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

export default App;
