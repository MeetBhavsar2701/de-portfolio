# Reference Study: Bruno Simon Folio 2025

## License
MIT License (Copyright (c) 2025 Bruno Simon)

## Architecture Summary (< 400 words)

Bruno Simon's portfolio is a vanilla Three.js application structured with an OOP service-locator pattern (`Game` singleton managing `Time`, `View`, `Physics`, `World`, `Camera`, `Audio`, and `Inputs`).

### 1. Render Loop & Time
`Time.js` uses `requestAnimationFrame` with delta time calculation and tick callbacks. The `Game` class orchestrates physics step updates, world entity updates, and `WebGLRenderer.render` per tick.

### 2. Physics Vehicle
Physics is powered by Rapier (`Physics.js`). The vehicle combines a dynamic rigid body with raycast suspensions (`Vehicle.js` / `Car.js`). It reads inputs (`Inputs.js` listening to keyboard, virtual joystick, or gamepads) to apply engine forces, steering angles on front wheels, and counter-roll / stabilizing impulses to prevent tipping.

### 3. Camera Follow
`Camera.js` maintains a target focus vector trailing the vehicle. It uses spherical/isometric-like orientation with smooth exponential damping (`lerp` based on delta time) and pulls back slightly as vehicle velocity increases.

### 4. Interaction Zones
`Areas.js` and individual `Area.js` subclasses define interactive bounding zones / trigger colliders in the physics world. When the vehicle enters a sensor zone, events trigger UI overlays, camera target adjustments, or animations (e.g. projects, lab, career milestones).

### 5. Asset Loading
`Resources.js` wraps `GLTFLoader`, `TextureLoader`, and audio decoders into a centralized loader with progress tracking, caching, and batched instancing (`InstancedGroup.js`).

---

## Reimplementation with React Three Fiber & Rapier

1. **Render Loop**: Replaced by R3F's native `useFrame(state, delta)` and `@react-three/rapier`'s `<Physics>` loop.
2. **Vehicle**: Implement via `@react-three/rapier` dynamic rigid body with responsive arcade forces (drive, steer, brake, self-righting angular damp/torque, respawn boundary).
3. **Camera Follow**: Smooth camera damp in `useFrame` tracking the vehicle's position with speed-based easing.
4. **Stations / Interaction Zones**: Rapier `<CuboidCollider sensor>` / `<CylinderCollider sensor>` triggering Zustand state changes (`activeStation`).
5. **Procedural Geometry & Shaders**: Procedural geometries, glowing materials, Bloom postprocessing, and instanced data packets flowing across the pipeline.

