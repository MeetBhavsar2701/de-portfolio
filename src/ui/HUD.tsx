import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { PROFILE } from '../content/profile';
import { useStore, STATION_NAMES, STATION_COORDINATES, StationName } from '../lib/store';

export function HUD() {
  const { progress } = useProgress();
  const activeStation = useStore((state) => state.activeStation);
  const isMuted = useStore((state) => state.isMuted);
  const toggleMute = useStore((state) => state.toggleMute);
  const requestTeleport = useStore((state) => state.requestTeleport);

  // Hint fader: disappears after 8 seconds
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const isLoaded = progress >= 100;

  return (
    <div style={{ pointerEvents: 'none' }} className="hud-root">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#020617',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            fontFamily: 'system-ui, sans-serif',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#38bdf8' }}>
            Initializing Data Pipeline World...
          </div>
          <div
            style={{
              width: '280px',
              height: '8px',
              background: '#1e293b',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                transition: 'width 0.2s ease-out',
              }}
            />
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            {Math.round(progress)}%
          </div>
        </div>
      )}

      {/* Top Left: Profile Badge */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '12px 18px',
          borderRadius: '10px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
          {PROFILE.name}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 500 }}>
          {PROFILE.headline}
        </div>
      </div>

      {/* Top Right: Teleport Station Selector & Fast Links */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
          pointerEvents: 'auto',
          alignItems: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Teleport Dropdown / Buttons */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginRight: '4px' }}>TELEPORT:</span>
          {STATION_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => {
                const target = STATION_COORDINATES[name as StationName];
                requestTeleport([target[0], 1.5, target[2] + 4]);
              }}
              style={{
                background: activeStation === name ? '#0284c7' : 'transparent',
                color: activeStation === name ? '#ffffff' : '#cbd5e1',
                border: '1px solid ' + (activeStation === name ? '#38bdf8' : 'rgba(255,255,255,0.1)'),
                padding: '4px 8px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Skip to 2D Resume */}
        <a
          href="/resume"
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '8px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Skip to 2D Resume
        </a>

        {/* Mute Button Toggle */}
        <button
          onClick={toggleMute}
          aria-label="Toggle Audio"
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: isMuted ? '#94a3b8' : '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
        </button>
      </div>

      {/* Active Station Chip */}
      {activeStation && (
        <div
          data-testid="station-chip"
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(2, 132, 199, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '8px 24px',
            borderRadius: '999px',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.05em',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
            border: '1px solid #38bdf8',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          STATION: {activeStation.toUpperCase()}
        </div>
      )}

      {/* Bottom Hint */}
      {showHint && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '10px 22px',
            borderRadius: '999px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#e2e8f0',
            fontSize: '0.85rem',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            transition: 'opacity 0.6s ease',
            pointerEvents: 'auto',
          }}
        >
          Use <strong style={{ color: '#38bdf8' }}>WASD</strong> or{' '}
          <strong style={{ color: '#38bdf8' }}>Arrows</strong> to drive & steer •{' '}
          <strong style={{ color: '#38bdf8' }}>SPACE</strong> to brake •{' '}
          <strong style={{ color: '#38bdf8' }}>R</strong> to reset position
        </div>
      )}
    </div>
  );
}

