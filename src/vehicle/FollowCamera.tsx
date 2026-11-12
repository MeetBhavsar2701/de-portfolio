import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VEHICLE_CONFIG } from '../vehicle/config';

export function FollowCamera() {
  const currentPos = useRef(new THREE.Vector3(0, 5, 14));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    // Locate vehicle in scene
    const vehicle = state.scene.getObjectByName('vehicle');
    if (!vehicle) return;

    // Get vehicle world position & velocity if available
    const targetPos = vehicle.position.clone();
    
    // Ideal camera position behind and above
    // Since pipeline runs along X axis, default offset is slightly back in Z and up in Y
    const desiredPos = targetPos.clone().add(
      new THREE.Vector3(
        VEHICLE_CONFIG.cameraOffset[0],
        VEHICLE_CONFIG.cameraOffset[1],
        VEHICLE_CONFIG.cameraOffset[2]
      )
    );

    // Smoothly interpolate current camera position
    currentPos.current.lerp(desiredPos, VEHICLE_CONFIG.cameraDamping);
    state.camera.position.copy(currentPos.current);

    // Smoothly interpolate look target
    const desiredLook = targetPos.clone().add(
      new THREE.Vector3(
        VEHICLE_CONFIG.cameraLookOffset[0],
        VEHICLE_CONFIG.cameraLookOffset[1],
        VEHICLE_CONFIG.cameraLookOffset[2]
      )
    );
    currentLookAt.current.lerp(desiredLook, VEHICLE_CONFIG.cameraDamping * 1.5);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

