import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { ShotGeometry } from '../../domain/shotGeometry';
import type { TableSpec, Vec2 } from '../../domain/types';
import type { DisplayOptions } from '../../state/defaultState';
import { Ball } from './Ball';
import { DraggableBall } from './DragControls';
import { ShotHelpers } from './ShotHelpers';
import { TableModel } from './TableModel';

type BilliardsSceneProps = {
  spec: TableSpec;
  geometry: ShotGeometry;
  displayOptions: DisplayOptions;
  onCueBallChange: (position: Vec2) => void;
  onObjectBallChange: (position: Vec2) => void;
};

export function BilliardsScene({
  spec,
  geometry,
  displayOptions,
  onCueBallChange,
  onObjectBallChange
}: BilliardsSceneProps) {
  return (
    <Canvas shadows className="billiards-canvas">
      <color attach="background" args={['#10221d']} />
      <PerspectiveCamera makeDefault position={[0, 1.65, 1.65]} fov={45} />
      <OrbitControls
        target={[0, 0, 0]}
        enablePan={false}
        minDistance={1.25}
        maxDistance={3.6}
        minPolarAngle={0.24}
        maxPolarAngle={1.38}
      />
      <ambientLight intensity={0.8} />
      <directionalLight position={[1.6, 3, 1.2]} intensity={1.8} castShadow />
      <TableModel spec={spec} />
      <ShotHelpers geometry={geometry} ballRadius={spec.ballRadius} displayOptions={displayOptions} />
      <DraggableBall bounds={spec.playableBounds} onChange={onCueBallChange}>
        <Ball position={geometry.cueBall} radius={spec.ballRadius} color="#f8f9fb" name="cue-ball" />
      </DraggableBall>
      <DraggableBall bounds={spec.playableBounds} onChange={onObjectBallChange}>
        <Ball position={geometry.objectBall} radius={spec.ballRadius} color="#c43d32" name="object-ball" />
      </DraggableBall>
    </Canvas>
  );
}
