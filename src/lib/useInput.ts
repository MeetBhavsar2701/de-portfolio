import { useEffect, useRef } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
}

// Global virtual joystick state for touch integration
export const virtualInput: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
  reset: false,
};

export function useInput() {
  const inputRef = useRef<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputRef.current.right = true;
          break;
        case 'Space':
          inputRef.current.brake = true;
          break;
        case 'KeyR':
          inputRef.current.reset = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputRef.current.right = false;
          break;
        case 'Space':
          inputRef.current.brake = false;
          break;
        case 'KeyR':
          inputRef.current.reset = false;
          break;
      }
    };

    const handleBlur = () => {
      inputRef.current.forward = false;
      inputRef.current.backward = false;
      inputRef.current.left = false;
      inputRef.current.right = false;
      inputRef.current.brake = false;
      inputRef.current.reset = false;

      virtualInput.forward = false;
      virtualInput.backward = false;
      virtualInput.left = false;
      virtualInput.right = false;
      virtualInput.brake = false;
      virtualInput.reset = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleBlur();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return {
    get current() {
      // Combine keyboard and virtual touch inputs
      return {
        forward: inputRef.current.forward || virtualInput.forward,
        backward: inputRef.current.backward || virtualInput.backward,
        left: inputRef.current.left || virtualInput.left,
        right: inputRef.current.right || virtualInput.right,
        brake: inputRef.current.brake || virtualInput.brake,
        reset: inputRef.current.reset || virtualInput.reset,
      };
    },
  };
}
