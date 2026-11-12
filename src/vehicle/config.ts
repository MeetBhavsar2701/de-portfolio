export const VEHICLE_CONFIG = {
  // Speed & physics forces
  maxSpeed: 24,
  accelerationForce: 45,
  reverseForce: 25,
  turnSpeed: 2.8,
  brakeDamping: 6.0,
  linearDamping: 1.2,
  angularDamping: 4.5,
  
  // Dimensions & bounds
  mass: 150,
  dimensions: [1.8, 0.7, 1.2] as [number, number, number],
  respawnY: -20,
  worldMinX: -40,
  worldMaxX: 360,
  worldZBound: 30,

  // Camera settings
  cameraOffset: [0, 5, 9] as [number, number, number],
  cameraLookOffset: [0, 1.2, 0] as [number, number, number],
  cameraDamping: 0.08,
  speedLagMultiplier: 0.15,

  // Auto righting
  autoRightCheckInterval: 0.5,
  autoRightAngleThreshold: Math.PI / 3, // ~60 degrees tilt
  maxUpsideDownDuration: 2.0, // seconds
};

