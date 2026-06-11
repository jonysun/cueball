import { Line, OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import type { ShotGeometry } from '../../domain/shotGeometry';
import type { Bounds2, TableSpec, Vec2 } from '../../domain/types';
import type { DisplayOptions, ViewMode } from '../../state/defaultState';
import { Ball } from './Ball';
import { DraggableBall } from './DragControls';
import { ShotHelpers } from './ShotHelpers';
import { TableModel } from './TableModel';

type BilliardsSceneProps = {
  spec: TableSpec;
  geometry: ShotGeometry;
  displayOptions: DisplayOptions;
  viewMode: ViewMode;
  cameraLocked: boolean;
  cueBallLocked: boolean;
  objectBallLocked: boolean;
  examMode: boolean;
  examAimTarget: Vec2;
  onCueBallChange: (position: Vec2) => void;
  onObjectBallChange: (position: Vec2) => void;
  onExamAimTargetChange: (position: Vec2) => void;
};

export function BilliardsScene({
  spec,
  geometry,
  displayOptions,
  viewMode,
  cameraLocked,
  cueBallLocked,
  objectBallLocked,
  examMode,
  examAimTarget,
  onCueBallChange,
  onObjectBallChange,
  onExamAimTargetChange
}: BilliardsSceneProps) {
  return (
    <Canvas shadows className="billiards-canvas">
      <color attach="background" args={['#10221d']} />
      {viewMode === '2d' ? <TopDownCamera spec={spec} /> : <AngledCamera targetY={spec.ballRadius} />}
      {viewMode === '3d' && (
        <OrbitControls
          target={[0, spec.ballRadius, 0]}
          enabled={!cameraLocked}
          enablePan={false}
          minDistance={1.25}
          maxDistance={3.6}
          minPolarAngle={0.14}
          maxPolarAngle={Math.PI / 2}
        />
      )}
      <ambientLight intensity={0.8} />
      <directionalLight position={[1.6, 3, 1.2]} intensity={1.8} castShadow />
      <TableModel spec={spec} />
      <ShotHelpers geometry={geometry} ballRadius={spec.ballRadius} displayOptions={displayOptions} />
      {examMode && (
        <ExamAimControl
          cueBall={geometry.cueBall}
          aimTarget={examAimTarget}
          bounds={spec.playableBounds}
          ballRadius={spec.ballRadius}
          onChange={onExamAimTargetChange}
        />
      )}
      <DraggableBall bounds={spec.playableBounds} disabled={cueBallLocked} onChange={onCueBallChange}>
        <Ball position={geometry.cueBall} radius={spec.ballRadius} color="#f8f9fb" name="cue-ball" />
      </DraggableBall>
      <DraggableBall bounds={spec.playableBounds} disabled={objectBallLocked} onChange={onObjectBallChange}>
        <Ball position={geometry.objectBall} radius={spec.ballRadius} color="#c43d32" name="object-ball" opacity={0.62} />
      </DraggableBall>
      <ObjectBallCenter position={geometry.objectBall} radius={spec.ballRadius} />
    </Canvas>
  );
}

function AngledCamera({ targetY }: { targetY: number }) {
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 1.42, 1.78]}
      fov={45}
      onUpdate={(camera) => camera.lookAt(0, targetY, 0)}
    />
  );
}

function TopDownCamera({ spec }: { spec: TableSpec }) {
  const { size } = useThree();
  const zoom = Math.min(size.width / (spec.outerLength * 1.16), size.height / (spec.outerWidth * 1.26));

  return (
    <OrthographicCamera
      makeDefault
      position={[0, 4, 0]}
      near={0.1}
      far={10}
      zoom={zoom}
      onUpdate={(camera) => {
        camera.up.set(0, 0, -1);
        camera.lookAt(0, spec.ballRadius, 0);
        camera.updateProjectionMatrix();
      }}
    />
  );
}

function ObjectBallCenter({ position, radius }: { position: Vec2; radius: number }) {
  return (
    <mesh position={[position.x, radius, position.z]} renderOrder={7}>
      <sphereGeometry args={[radius * 0.12, 18, 10]} />
      <meshBasicMaterial color="#111827" depthTest={false} />
    </mesh>
  );
}

function ExamAimControl({
  cueBall,
  aimTarget,
  bounds,
  ballRadius,
  onChange
}: {
  cueBall: Vec2;
  aimTarget: Vec2;
  bounds: Bounds2;
  ballRadius: number;
  onChange: (position: Vec2) => void;
}) {
  const lineY = ballRadius * 1.25;

  return (
    <group>
      <Line
        points={[
          [cueBall.x, lineY, cueBall.z],
          [aimTarget.x, lineY, aimTarget.z]
        ]}
        color="#2563eb"
        lineWidth={4}
        depthTest={false}
        renderOrder={6}
      />
      <DraggableBall bounds={bounds} onChange={onChange}>
        <mesh position={[aimTarget.x, lineY, aimTarget.z]} name="exam-aim-target" renderOrder={8}>
          <sphereGeometry args={[ballRadius * 0.28, 24, 14]} />
          <meshBasicMaterial color="#2563eb" depthTest={false} />
        </mesh>
      </DraggableBall>
    </group>
  );
}
