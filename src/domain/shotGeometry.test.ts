import { describe, expect, it } from 'vitest';
import { calculateShotGeometry } from './shotGeometry';
import { defaultTableSpec } from './tableSpec';
import type { Vec2 } from './types';

const spec = defaultTableSpec;
const R = spec.ballRadius;

function geometryForAngle(degrees: number) {
  const objectBall: Vec2 = { x: 0, z: 0 };
  const pocketCenter: Vec2 = { x: 1, z: 0 };
  const ghostBall: Vec2 = { x: -2 * R, z: 0 };
  const distance = 0.6;
  const radians = (degrees * Math.PI) / 180;
  const cueBall: Vec2 = {
    x: ghostBall.x - Math.cos(radians) * distance,
    z: ghostBall.z - Math.sin(radians) * distance
  };

  return calculateShotGeometry({ cueBall, objectBall, pocketCenter, spec });
}

describe('calculateShotGeometry', () => {
  it('returns 100 percent coverage for a straight shot', () => {
    const result = geometryForAngle(0);

    expect(result.valid).toBe(true);
    expect(result.cutAngleDegrees).toBeCloseTo(0, 5);
    expect(result.coverage).toBeCloseTo(1, 5);
  });

  it('returns 50 percent coverage for a 30 degree cut', () => {
    const result = geometryForAngle(30);

    expect(result.valid).toBe(true);
    expect(result.cutAngleDegrees).toBeCloseTo(30, 5);
    expect(result.coverage).toBeCloseTo(0.5, 5);
  });

  it('returns 0 percent coverage for a 90 degree cut', () => {
    const result = geometryForAngle(90);

    expect(result.cutAngleDegrees).toBeCloseTo(90, 5);
    expect(result.coverage).toBeCloseTo(0, 5);
  });

  it('marks cuts over 90 degrees invalid and clamps coverage to zero', () => {
    const result = geometryForAngle(110);

    expect(result.valid).toBe(false);
    expect(result.coverage).toBe(0);
    expect(result.warnings).toContain('Cut angle is over 90 degrees, so the direct pot geometry is invalid.');
  });

  it('warns when cue ball and object ball overlap', () => {
    const result = calculateShotGeometry({
      cueBall: { x: 0.02, z: 0 },
      objectBall: { x: 0, z: 0 },
      pocketCenter: { x: 1, z: 0 },
      spec
    });

    expect(result.warnings).toContain('Cue ball and object ball overlap.');
  });

  it('marks object path invalid when object ball is at the pocket center', () => {
    const result = calculateShotGeometry({
      cueBall: { x: -0.4, z: 0 },
      objectBall: { x: 1, z: 0 },
      pocketCenter: { x: 1, z: 0 },
      spec
    });

    expect(result.valid).toBe(false);
    expect(result.warnings).toContain('Object ball is too close to the selected pocket.');
  });
});
