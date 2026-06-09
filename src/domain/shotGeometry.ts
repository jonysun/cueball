import type { TableSpec, Vec2 } from './types';
import { add, clamp, distance, dot, normalize, scale, subtract } from './vector';

export type ShotGeometryInput = {
  cueBall: Vec2;
  objectBall: Vec2;
  pocketCenter: Vec2;
  spec: TableSpec;
};

export type ShotGeometry = {
  valid: boolean;
  cueBall: Vec2;
  objectBall: Vec2;
  pocketCenter: Vec2;
  objectPath: Vec2;
  ghostBall: Vec2;
  cuePath: Vec2;
  cutAngleRadians: number;
  cutAngleDegrees: number;
  coverage: number;
  coveragePercent: number;
  overlapLength: number;
  warnings: string[];
};

const ZERO: Vec2 = { x: 0, z: 0 };

export function calculateShotGeometry(input: ShotGeometryInput): ShotGeometry {
  const warnings: string[] = [];
  let valid = true;

  if (distance(input.cueBall, input.objectBall) < input.spec.ballDiameter) {
    warnings.push('Cue ball and object ball overlap.');
  }

  const objectPath = normalize(subtract(input.pocketCenter, input.objectBall));

  if (!objectPath) {
    warnings.push('Object ball is too close to the selected pocket.');
    return invalidGeometry(input, warnings);
  }

  const ghostBall = add(input.objectBall, scale(objectPath, -input.spec.ballDiameter));
  const cuePath = normalize(subtract(ghostBall, input.cueBall));

  if (!cuePath) {
    warnings.push('Cue ball is too close to the ghost ball.');
    return invalidGeometry(input, warnings, objectPath, ghostBall);
  }

  const cosine = clamp(dot(objectPath, cuePath), -1, 1);
  const cutAngleRadians = Math.acos(cosine);
  const cutAngleDegrees = (cutAngleRadians * 180) / Math.PI;

  if (cutAngleDegrees > 90) {
    warnings.push('Cut angle is over 90 degrees, so the direct pot geometry is invalid.');
    valid = false;
  }

  const coverage = valid ? clamp(1 - Math.sin(cutAngleRadians), 0, 1) : 0;

  return {
    valid,
    cueBall: input.cueBall,
    objectBall: input.objectBall,
    pocketCenter: input.pocketCenter,
    objectPath,
    ghostBall,
    cuePath,
    cutAngleRadians,
    cutAngleDegrees,
    coverage,
    coveragePercent: coverage * 100,
    overlapLength: coverage * input.spec.ballDiameter,
    warnings
  };
}

function invalidGeometry(
  input: ShotGeometryInput,
  warnings: string[],
  objectPath: Vec2 = ZERO,
  ghostBall: Vec2 = input.objectBall
): ShotGeometry {
  return {
    valid: false,
    cueBall: input.cueBall,
    objectBall: input.objectBall,
    pocketCenter: input.pocketCenter,
    objectPath,
    ghostBall,
    cuePath: ZERO,
    cutAngleRadians: 0,
    cutAngleDegrees: 0,
    coverage: 0,
    coveragePercent: 0,
    overlapLength: 0,
    warnings
  };
}
