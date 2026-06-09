import type { PocketId, Vec2 } from '../domain/types';

export type PanelMode = 'teaching' | 'formula';

export type DisplayOptions = {
  objectPath: boolean;
  cuePath: boolean;
  cuePathBand: boolean;
  ghostBall: boolean;
  objectDiameter: boolean;
  overlapSegment: boolean;
};

export type AppState = {
  cueBall: Vec2;
  objectBall: Vec2;
  selectedPocket: PocketId;
  panelMode: PanelMode;
  displayOptions: DisplayOptions;
};

export const defaultDisplayOptions: DisplayOptions = {
  objectPath: true,
  cuePath: true,
  cuePathBand: true,
  ghostBall: true,
  objectDiameter: true,
  overlapSegment: true
};

export const defaultAppState: AppState = {
  cueBall: { x: -0.55, z: 0.22 },
  objectBall: { x: 0.22, z: -0.08 },
  selectedPocket: 'corner-ne',
  panelMode: 'teaching',
  displayOptions: defaultDisplayOptions
};
