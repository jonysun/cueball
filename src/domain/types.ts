export type PocketId =
  | 'corner-nw'
  | 'middle-n'
  | 'corner-ne'
  | 'corner-sw'
  | 'middle-s'
  | 'corner-se';

export type Vec2 = {
  x: number;
  z: number;
};

export type Bounds2 = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type Pocket = {
  id: PocketId;
  label: string;
  center: Vec2;
  opening: number;
  kind: 'corner' | 'middle';
};

export type TableSpec = {
  innerLength: number;
  innerWidth: number;
  outerLength: number;
  outerWidth: number;
  height: number;
  ballDiameter: number;
  ballRadius: number;
  cornerPocketOpening: number;
  middlePocketOpening: number;
  playableBounds: Bounds2;
  pockets: Pocket[];
};
