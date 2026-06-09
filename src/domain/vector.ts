import type { Bounds2, Vec2 } from './types';

export const EPSILON = 1e-6;

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, z: a.z + b.z };
}

export function subtract(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, z: a.z - b.z };
}

export function scale(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, z: v.z * scalar };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.z * b.z;
}

export function length(v: Vec2): number {
  return Math.hypot(v.x, v.z);
}

export function distance(a: Vec2, b: Vec2): number {
  return length(subtract(a, b));
}

export function normalize(v: Vec2): Vec2 | null {
  const magnitude = length(v);

  if (magnitude < EPSILON) {
    return null;
  }

  return { x: v.x / magnitude, z: v.z / magnitude };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampVecToBounds(point: Vec2, bounds: Bounds2): Vec2 {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    z: clamp(point.z, bounds.minZ, bounds.maxZ)
  };
}
