import React from 'react';
import { SourceStation } from './SourceStation';
import { IngestStation } from './IngestStation';
import { TransformStation } from './TransformStation';
import { WarehouseStation } from './WarehouseStation';
import { DashboardStation } from './DashboardStation';
import { OutputStation } from './OutputStation';
import { StationPlatforms } from './StationPlatforms';

export function AllStations() {
  return (
    <group>
      <StationPlatforms />
      <SourceStation />
      <IngestStation />
      <TransformStation />
      <WarehouseStation />
      <DashboardStation />
      <OutputStation />
    </group>
  );
}

