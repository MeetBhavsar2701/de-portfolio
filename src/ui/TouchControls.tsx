import React, { useState, useEffect, useRef } from 'react';
import { virtualInput } from '../lib/useInput';

export function TouchControls() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [joystickActive, setJoystickActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });

  const joystickOrigin = useRef<{ x: number; y: number } | null>(null);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect coarse pointer or touch support
    const hasTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    setIsTouchDevice(hasTouch);
  }, []);

  if (!isTouchDevice) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    joystickOrigin.current = { x: centerX, y: centerY };
    setJoystickActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickActive || !joystickOrigin.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        const dx = touch.clientX - joystickOrigin.current.x;
        const dy = touch.clientY - joystickOrigin.current.y;
        const maxDist = 45;
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
        const angle = Math.atan2(dy, dx);

        const clampedX = Math.cos(angle) * dist;
        const clampedY = Math.sin(angle) * dist;

        setStickPos({ x: clampedX, y: clampedY });

        // Update virtual input with deadzone
        const deadzone = 10;
        virtualInput.forward = clampedY < -deadzone;
        virtualInput.backward = clampedY > deadzone;
        virtualInput.left = clampedX < -deadzone;
        virtualInput.right = clampedX > deadzone;
        break;
      }
    }
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    setStickPos({ x: 0, y: 0 });
    touchIdRef.current = null;
    joystickOrigin.current = null;
    virtualInput.forward = false;
    virtualInput.backward = false;
    virtualInput.left = false;
    virtualInput.right = false;
  };

  return (
    <div
      data-testid="touch-controls"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9500,
        touchAction: 'none',
      }}
    >
      {/* Left Touch Joystick Zone */}
      <div
        data-testid="touch-joystick"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          position: 'fixed',
          bottom: '25px',
          left: '25px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
        }}
      >
        {/* Joystick Thumb Stick */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            border: '2px solid #38bdf8',
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Right Action Buttons: Brake & Reset */}
      <div
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'auto',
        }}
      >
        {/* Brake Button */}
        <button
          data-testid="touch-brake"
          onTouchStart={(e) => {
            e.preventDefault();
            virtualInput.brake = true;
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            virtualInput.brake = false;
          }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            border: '2px solid #fca5a5',
            color: '#fff',
            fontWeight: 800,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'none',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
          }}
        >
          BRAKE
        </button>

        {/* Reset Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            virtualInput.reset = true;
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            virtualInput.reset = false;
          }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '2px solid #38bdf8',
            color: '#38bdf8',
            fontWeight: 700,
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'none',
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

