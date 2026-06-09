import type { Vec2 } from '../../domain/types';

type BallProps = {
  position: Vec2;
  radius: number;
  color: string;
  name: string;
  opacity?: number;
};

export function Ball({ position, radius, color, name, opacity = 1 }: BallProps) {
  return (
    <mesh position={[position.x, radius, position.z]} castShadow receiveShadow name={name}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.42}
        metalness={0.05}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
