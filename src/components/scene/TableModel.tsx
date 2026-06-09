import type { TableSpec } from '../../domain/types';

type TableModelProps = {
  spec: TableSpec;
};

export function TableModel({ spec }: TableModelProps) {
  const railWidthX = (spec.outerLength - spec.innerLength) / 2;
  const railWidthZ = (spec.outerWidth - spec.innerWidth) / 2;
  const railHeight = 0.085;
  const slateHeight = 0.045;

  return (
    <group>
      <mesh position={[0, -slateHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[spec.innerLength, slateHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#176d54" roughness={0.86} />
      </mesh>

      <mesh position={[0, railHeight / 2, -spec.innerWidth / 2 - railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[0, railHeight / 2, spec.innerWidth / 2 + railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[-spec.innerLength / 2 - railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[spec.innerLength / 2 + railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
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
