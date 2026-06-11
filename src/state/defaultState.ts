import type { PocketId, Vec2 } from '../domain/types';

export type PanelMode = 'teaching' | 'formula';
export type Language = 'zh' | 'en';
export type ViewMode = '3d' | '2d';
export type ExamDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExamRating = 'good' | 'very-good' | 'perfect' | 'try-again';

export type ExamResult = {
  userCoveragePercent: number;
  theoreticalCoveragePercent: number;
  userOverlapMm: number;
  theoreticalOverlapMm: number;
  differencePercent: number;
  rating: ExamRating;
};

export type DisplayOptions = {
  objectPath: boolean;
  cuePath: boolean;
  cuePathBand: boolean;
  ghostBall: boolean;
  objectDiameter: boolean;
  overlapSegment: boolean;
  diameterProjection: boolean;
  cueProjection: boolean;
  postImpactCuePath: boolean;
  cutAngle: boolean;
};

export type AppState = {
  cueBall: Vec2;
  objectBall: Vec2;
  selectedPocket: PocketId;
  panelMode: PanelMode;
  language: Language;
  viewMode: ViewMode;
  cameraLocked: boolean;
  cueBallLocked: boolean;
  objectBallLocked: boolean;
  examMode: boolean;
  examDifficulty: ExamDifficulty;
  examAimTarget: Vec2;
  examResult: ExamResult | null;
  displayOptions: DisplayOptions;
};

export const defaultDisplayOptions: DisplayOptions = {
  objectPath: true,
  cuePath: true,
  cuePathBand: true,
  ghostBall: true,
  objectDiameter: true,
  overlapSegment: true,
  diameterProjection: true,
  cueProjection: true,
  postImpactCuePath: true,
  cutAngle: true
};

export const defaultAppState: AppState = {
  cueBall: { x: -0.55, z: 0.22 },
  objectBall: { x: 0.22, z: -0.08 },
  selectedPocket: 'corner-ne',
  panelMode: 'teaching',
  language: 'zh',
  viewMode: '3d',
  cameraLocked: false,
  cueBallLocked: false,
  objectBallLocked: false,
  examMode: false,
  examDifficulty: 'beginner',
  examAimTarget: { x: 0, z: 0 },
  examResult: null,
  displayOptions: defaultDisplayOptions
};
