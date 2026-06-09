import type { ThreeEvent } from '@react-three/fiber';
import type { ReactNode } from 'react';
import type { Bounds2, Vec2 } from '../../domain/types';
import { clampVecToBounds } from '../../domain/vector';

type DraggableBallProps = {
  bounds: Bounds2;
  onChange: (position: Vec2) => void;
  children: ReactNode;
};

export function DraggableBall({ bounds, onChange, children }: DraggableBallProps) {
  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (event.buttons !== 1) {
      return;
    }

    event.stopPropagation();
    onChange(clampVecToBounds({ x: event.point.x, z: event.point.z }, bounds));
  }

  return (
    <group onPointerDown={(event) => event.stopPropagation()} onPointerMove={handlePointerMove}>
      {children}
    </group>
  );
}
