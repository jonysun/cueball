import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping } from 'three';
import type { TableSpec } from '../../domain/types';

type TableModelProps = {
  spec: TableSpec;
};

export function TableModel({ spec }: TableModelProps) {
  const railWidthX = (spec.outerLength - spec.innerLength) / 2;
  const railWidthZ = (spec.outerWidth - spec.innerWidth) / 2;
  const railHeight = 0.0425;
  const slateHeight = 0.045;
  const bevelRun = Math.min(railWidthX, railWidthZ) * 0.48;
  const bevelLength = Math.hypot(bevelRun, railHeight);
  const bevelAngle = Math.atan2(railHeight, bevelRun);
  const woodTexture = useWoodTexture();
  const woodMap = woodTexture ?? undefined;

  return (
    <group>
      <mesh position={[0, -slateHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[spec.innerLength, slateHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#176d54" roughness={0.86} />
      </mesh>

      <mesh position={[0, railHeight / 2, -spec.innerWidth / 2 - railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#9a6438" map={woodMap} roughness={0.72} />
      </mesh>
      <mesh position={[0, railHeight / 2, spec.innerWidth / 2 + railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#9a6438" map={woodMap} roughness={0.72} />
      </mesh>
      <mesh position={[-spec.innerLength / 2 - railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#9a6438" map={woodMap} roughness={0.72} />
      </mesh>
      <mesh position={[spec.innerLength / 2 + railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#9a6438" map={woodMap} roughness={0.72} />
      </mesh>

      <mesh
        position={[0, railHeight / 2, -spec.innerWidth / 2 - bevelRun / 2]}
        rotation={[bevelAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[spec.innerLength, 0.006, bevelLength]} />
        <meshStandardMaterial color="#b07a4a" map={woodMap} roughness={0.76} />
      </mesh>
      <mesh
        position={[0, railHeight / 2, spec.innerWidth / 2 + bevelRun / 2]}
        rotation={[-bevelAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[spec.innerLength, 0.006, bevelLength]} />
        <meshStandardMaterial color="#b07a4a" map={woodMap} roughness={0.76} />
      </mesh>
      <mesh
        position={[-spec.innerLength / 2 - bevelRun / 2, railHeight / 2, 0]}
        rotation={[0, 0, -bevelAngle]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[bevelLength, 0.006, spec.innerWidth]} />
        <meshStandardMaterial color="#b07a4a" map={woodMap} roughness={0.76} />
      </mesh>
      <mesh
        position={[spec.innerLength / 2 + bevelRun / 2, railHeight / 2, 0]}
        rotation={[0, 0, bevelAngle]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[bevelLength, 0.006, spec.innerWidth]} />
        <meshStandardMaterial color="#b07a4a" map={woodMap} roughness={0.76} />
      </mesh>

      {spec.pockets.map((pocket) => (
        <mesh key={pocket.id} position={[pocket.center.x, 0.006, pocket.center.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[pocket.opening / 2, 40]} />
          <meshBasicMaterial color="#050807" />
        </mesh>
      ))}
    </group>
  );
}

function useWoodTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 72;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#b87b45');
    gradient.addColorStop(0.45, '#8f572f');
    gradient.addColorStop(1, '#6d3f24');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1.35;

    for (let row = 0; row < 16; row += 1) {
      const y = 5 + row * 4.2;
      context.beginPath();

      for (let x = 0; x <= canvas.width; x += 6) {
        const wave = Math.sin(x * 0.055 + row * 0.7) * 1.6 + Math.sin(x * 0.017 + row) * 1.2;

        if (x === 0) {
          context.moveTo(x, y + wave);
        } else {
          context.lineTo(x, y + wave);
        }
      }

      context.strokeStyle = row % 3 === 0 ? 'rgb(74 41 22 / 34%)' : 'rgb(255 216 158 / 16%)';
      context.stroke();
    }

    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(8, 1);

    return texture;
  }, []);
}
