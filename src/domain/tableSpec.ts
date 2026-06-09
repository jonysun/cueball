import type { Bounds2, Pocket, PocketId, TableSpec } from './types';

export function mmToMeters(mm: number): number {
  return mm / 1000;
}

const innerLength = mmToMeters(2542);
const innerWidth = mmToMeters(1262);
const outerLength = mmToMeters(2826);
const outerWidth = mmToMeters(1546);
const height = mmToMeters(848);
const ballDiameter = mmToMeters(57.2);
const ballRadius = ballDiameter / 2;
const cornerPocketOpening = mmToMeters(132);
const middlePocketOpening = mmToMeters(86);

const halfLength = innerLength / 2;
const halfWidth = innerWidth / 2;

const playableBounds: Bounds2 = {
  minX: -halfLength + ballRadius,
  maxX: halfLength - ballRadius,
  minZ: -halfWidth + ballRadius,
  maxZ: halfWidth - ballRadius
};

const pockets: Pocket[] = [
  {
    id: 'corner-nw',
    label: 'Northwest corner',
    center: { x: -halfLength, z: -halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'middle-n',
    label: 'North middle',
    center: { x: 0, z: -halfWidth },
    opening: middlePocketOpening,
    kind: 'middle'
  },
  {
    id: 'corner-ne',
    label: 'Northeast corner',
    center: { x: halfLength, z: -halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'corner-sw',
    label: 'Southwest corner',
    center: { x: -halfLength, z: halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'middle-s',
    label: 'South middle',
    center: { x: 0, z: halfWidth },
    opening: middlePocketOpening,
    kind: 'middle'
  },
  {
    id: 'corner-se',
    label: 'Southeast corner',
    center: { x: halfLength, z: halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  }
];

export const defaultTableSpec: TableSpec = {
  innerLength,
  innerWidth,
  outerLength,
  outerWidth,
  height,
  ballDiameter,
  ballRadius,
  cornerPocketOpening,
  middlePocketOpening,
  playableBounds,
  pockets
};

export function getPocketById(id: PocketId, spec: TableSpec = defaultTableSpec): Pocket {
  const pocket = spec.pockets.find((candidate) => candidate.id === id);

  if (!pocket) {
    throw new Error(`Unknown pocket id: ${id}`);
  }

  return pocket;
}
