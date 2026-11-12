import { create } from 'zustand';

export type StationName =
  | 'Source'
  | 'Ingest'
  | 'Transform'
  | 'Warehouse'
  | 'Dashboard'
  | 'Output';

export const STATION_NAMES: StationName[] = [
  'Source',
  'Ingest',
  'Transform',
  'Warehouse',
  'Dashboard',
  'Output',
];

export const STATION_COORDINATES: Record<StationName, [number, number, number]> = {
  Source: [0, 0, 0],
  Ingest: [60, 0, 0],
  Transform: [120, 0, 0],
  Warehouse: [180, 0, 0],
  Dashboard: [240, 0, 0],
  Output: [300, 0, 0],
};

interface GameStore {
  activeStation: StationName | null;
  setActiveStation: (station: StationName | null) => void;
  teleportTarget: [number, number, number] | null;
  requestTeleport: (pos: [number, number, number] | null) => void;
  lastCheckpoint: [number, number, number];
  setLastCheckpoint: (pos: [number, number, number]) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const useStore = create<GameStore>((set) => ({
  activeStation: null,
  setActiveStation: (station) => set({ activeStation: station }),
  teleportTarget: null,
  requestTeleport: (pos) => set({ teleportTarget: pos }),
  lastCheckpoint: [0, 1.5, 5],
  setLastCheckpoint: (pos) => set({ lastCheckpoint: pos }),
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

