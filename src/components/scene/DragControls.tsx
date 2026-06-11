import type { ThreeEvent } from '@react-three/fiber';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Plane, Vector3 } from 'three';
import type { Bounds2, Vec2 } from '../../domain/types';
import { clampVecToBounds } from '../../domain/vector';

type DraggableBallProps = {
  bounds: Bounds2;
  disabled?: boolean;
  onChange: (position: Vec2) => void;
  children: ReactNode;
};

export function DraggableBall({ bounds, disabled = false, onChange, children }: DraggableBallProps) {
  const tablePlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const pointerPosition = useMemo(() => new Vector3(), []);

  function updatePosition(event: ThreeEvent<PointerEvent>) {
    if (disabled) {
      return;
    }

    const hit = event.ray.intersectPlane(tablePlane, pointerPosition);

    if (!hit) {
      return;
    }

    onChange(clampVecToBounds({ x: pointerPosition.x, z: pointerPosition.z }, bounds));
  }

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (disabled) {
      return;
    }

    event.stopPropagation();
    updatePosition(event);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (disabled) {
      return;
    }

    if (event.buttons !== 1) {
      return;
    }

    event.stopPropagation();
    updatePosition(event);
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (disabled) {
      return;
    }

    event.stopPropagation();
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  }

  return (
    <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {children}
    </group>
  );
}
