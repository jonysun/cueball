import { describe, expect, it } from 'vitest';
import { defaultTableSpec, getPocketById, mmToMeters } from './tableSpec';

describe('tableSpec', () => {
  it('converts millimeters to meters', () => {
    expect(mmToMeters(2542)).toBeCloseTo(2.542, 6);
    expect(mmToMeters(57.2)).toBeCloseTo(0.0572, 6);
  });

  it('uses the referenced true-scale table dimensions', () => {
    expect(defaultTableSpec.innerLength).toBeCloseTo(2.542, 6);
    expect(defaultTableSpec.innerWidth).toBeCloseTo(1.262, 6);
    expect(defaultTableSpec.outerLength).toBeCloseTo(2.826, 6);
    expect(defaultTableSpec.outerWidth).toBeCloseTo(1.546, 6);
    expect(defaultTableSpec.height).toBeCloseTo(0.848, 6);
    expect(defaultTableSpec.ballRadius).toBeCloseTo(0.0286, 6);
  });

  it('places six pockets around the inner playfield', () => {
    expect(defaultTableSpec.pockets).toHaveLength(6);
    expect(getPocketById('corner-ne').center).toEqual({
      x: defaultTableSpec.innerLength / 2,
      z: -defaultTableSpec.innerWidth / 2
    });
    expect(getPocketById('middle-s').opening).toBeCloseTo(0.086, 6);
    expect(getPocketById('corner-sw').opening).toBeCloseTo(0.132, 6);
  });

  it('defines playable bounds that keep ball centers inside the cushions', () => {
    expect(defaultTableSpec.playableBounds.minX).toBeCloseTo(
      -defaultTableSpec.innerLength / 2 + defaultTableSpec.ballRadius,
      6
    );
    expect(defaultTableSpec.playableBounds.maxZ).toBeCloseTo(
      defaultTableSpec.innerWidth / 2 - defaultTableSpec.ballRadius,
      6
    );
  });
});
