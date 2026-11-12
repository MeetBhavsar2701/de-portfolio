import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, STATION_NAMES, STATION_COORDINATES } from '../../src/lib/store';
import { VEHICLE_CONFIG } from '../../src/vehicle/config';

describe('Station configuration & order', () => {
  it('has 6 sequential stations along the pipeline', () => {
    expect(STATION_NAMES).toHaveLength(6);
    expect(STATION_NAMES).toEqual([
      'Source',
      'Ingest',
      'Transform',
      'Warehouse',
      'Dashboard',
      'Output',
    ]);
  });

  it('spaces stations approximately 60 units apart along X axis', () => {
    for (let i = 1; i < STATION_NAMES.length; i++) {
      const prevStation = STATION_NAMES[i - 1];
      const currStation = STATION_NAMES[i];
      const prevX = STATION_COORDINATES[prevStation][0];
      const currX = STATION_COORDINATES[currStation][0];
      expect(currX - prevX).toBe(60);
    }
  });
});

describe('Game Zustand Store', () => {
  beforeEach(() => {
    useStore.setState({
      activeStation: null,
      teleportTarget: null,
      lastCheckpoint: [0, 1.5, 5],
      isMuted: true,
    });
  });

  it('updates active station correctly', () => {
    expect(useStore.getState().activeStation).toBeNull();
    useStore.getState().setActiveStation('Source');
    expect(useStore.getState().activeStation).toBe('Source');
    useStore.getState().setActiveStation(null);
    expect(useStore.getState().activeStation).toBeNull();
  });

  it('toggles audio mute status', () => {
    expect(useStore.getState().isMuted).toBe(true);
    useStore.getState().toggleMute();
    expect(useStore.getState().isMuted).toBe(false);
    useStore.getState().toggleMute();
    expect(useStore.getState().isMuted).toBe(true);
  });

  it('handles teleportTarget updates', () => {
    expect(useStore.getState().teleportTarget).toBeNull();
    useStore.getState().requestTeleport([120, 1.5, 4]);
    expect(useStore.getState().teleportTarget).toEqual([120, 1.5, 4]);
  });
});

describe('Vehicle auto-right configuration', () => {
  it('specifies valid thresholds for auto-righting', () => {
    expect(VEHICLE_CONFIG.maxUpsideDownDuration).toBeLessThanOrEqual(2.0);
    expect(VEHICLE_CONFIG.respawnY).toBe(-20);
    expect(VEHICLE_CONFIG.autoRightAngleThreshold).toBeGreaterThan(0);
  });
});
