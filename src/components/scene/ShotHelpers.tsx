import { Html, Line } from '@react-three/drei';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import type { ShotGeometry } from '../../domain/shotGeometry';
import type { DisplayOptions } from '../../state/defaultState';
import { Ball } from './Ball';

type ShotHelpersProps = {
  geometry: ShotGeometry;
  ballRadius: number;
  displayOptions: DisplayOptions;
};

function point(x: number, z: number, y = 0.012): [number, number, number] {
  return [x, y, z];
}

export function ShotHelpers({ geometry, ballRadius, displayOptions }: ShotHelpersProps) {
  const objectLineEnd = {
    x: geometry.objectBall.x + geometry.objectPath.x * 1.4,
    z: geometry.objectBall.z + geometry.objectPath.z * 1.4
  };
  const cueLineEnd = {
    x: geometry.ghostBall.x + geometry.cuePath.x * 0.18,
    z: geometry.ghostBall.z + geometry.cuePath.z * 0.18
  };
  const perpendicular = {
    x: -geometry.cuePath.z,
    z: geometry.cuePath.x
  };
  const postImpactPath = getPostImpactCuePath(geometry);
  const postImpactEnd = {
    x: geometry.ghostBall.x + postImpactPath.x * 0.72,
    z: geometry.ghostBall.z + postImpactPath.z * 0.72
  };
  const cueLineOffset =
    (geometry.objectBall.x - geometry.ghostBall.x) * perpendicular.x +
    (geometry.objectBall.z - geometry.ghostBall.z) * perpendicular.z;
  const projectionStartOffset = Math.max(-ballRadius, -ballRadius - cueLineOffset);
  const projectionEndOffset = Math.min(ballRadius, ballRadius - cueLineOffset);
  const hasProjectionSegment = projectionEndOffset > projectionStartOffset;
  const showDiameter = displayOptions.objectDiameter || displayOptions.diameterProjection || displayOptions.overlapSegment;
  const showProjectionSegment =
    hasProjectionSegment && (displayOptions.overlapSegment || displayOptions.diameterProjection);

  function diameterPoint(offset: number, y = ballRadius) {
    return point(
      geometry.objectBall.x + perpendicular.x * offset,
      geometry.objectBall.z + perpendicular.z * offset,
      y
    );
  }

  return (
    <group>
      {displayOptions.objectPath && (
        <Line
          points={[point(geometry.objectBall.x, geometry.objectBall.z), point(objectLineEnd.x, objectLineEnd.z)]}
          color={geometry.valid ? '#1aa56b' : '#c2410c'}
          lineWidth={3}
        />
      )}
      {displayOptions.cuePath && (
        <Line
          points={[point(geometry.cueBall.x, geometry.cueBall.z, 0.018), point(cueLineEnd.x, cueLineEnd.z, 0.018)]}
          color="#2f6fed"
          lineWidth={3}
        />
      )}
      {displayOptions.cuePathBand && (
        <CuePathCylinder geometry={geometry} ballRadius={ballRadius} />
      )}
      {displayOptions.ghostBall && (
        <Ball position={geometry.ghostBall} radius={ballRadius} color="#d7ecff" name="ghost-ball" opacity={0.38} />
      )}
      {showDiameter && (
        <Line
          points={[diameterPoint(-ballRadius), diameterPoint(ballRadius)]}
          color="#101817"
          lineWidth={3}
          depthTest={false}
          renderOrder={4}
        />
      )}
      {showProjectionSegment && (
        <Line
          points={[diameterPoint(projectionStartOffset), diameterPoint(projectionEndOffset)]}
          color={displayOptions.diameterProjection ? '#f59e0b' : '#d92d20'}
          lineWidth={7}
          depthTest={false}
          renderOrder={5}
        />
      )}
      {displayOptions.postImpactCuePath && (
        <Line
          points={[point(geometry.ghostBall.x, geometry.ghostBall.z, 0.05), point(postImpactEnd.x, postImpactEnd.z, 0.05)]}
          color="#7c3aed"
          lineWidth={4}
        />
      )}
      {displayOptions.cutAngle && geometry.valid && (
        <CutAngleAnnotation geometry={geometry} ballRadius={ballRadius} />
      )}
    </group>
  );
}

function CutAngleAnnotation({ geometry, ballRadius }: { geometry: ShotGeometry; ballRadius: number }) {
  const arc = useMemo(() => {
    const startAngle = Math.atan2(geometry.cuePath.z, geometry.cuePath.x);
    const endAngle = Math.atan2(geometry.objectPath.z, geometry.objectPath.x);
    let delta = endAngle - startAngle;

    while (delta > Math.PI) {
      delta -= Math.PI * 2;
    }

    while (delta < -Math.PI) {
      delta += Math.PI * 2;
    }

    const radius = ballRadius * 4.2;
    const points = Array.from({ length: 25 }, (_, index) => {
      const angle = startAngle + (delta * index) / 24;

      return point(
        geometry.ghostBall.x + Math.cos(angle) * radius,
        geometry.ghostBall.z + Math.sin(angle) * radius,
        ballRadius * 1.9
      );
    });
    const middleAngle = startAngle + delta / 2;
    const labelPosition: [number, number, number] = [
      geometry.ghostBall.x + Math.cos(middleAngle) * radius * 1.25,
      ballRadius * 2.45,
      geometry.ghostBall.z + Math.sin(middleAngle) * radius * 1.25
    ];

    return { points, labelPosition };
  }, [ballRadius, geometry]);

  return (
    <group>
      <Line points={arc.points} color="#0f172a" lineWidth={3} depthTest={false} renderOrder={6} />
      <Html position={arc.labelPosition} center>
        <span className="angle-label">a {geometry.cutAngleDegrees.toFixed(1)}°</span>
      </Html>
    </group>
  );
}

type CuePathCylinderProps = {
  geometry: ShotGeometry;
  ballRadius: number;
};

function CuePathCylinder({ geometry, ballRadius }: CuePathCylinderProps) {
  const dx = geometry.ghostBall.x - geometry.cueBall.x;
  const dz = geometry.ghostBall.z - geometry.cueBall.z;
  const length = Math.hypot(dx, dz);
  const quaternion = useMemo(() => {
    const direction = new Vector3(dx, 0, dz).normalize();

    return new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction);
  }, [dx, dz]);

  if (length < 1e-6) {
    return null;
  }

  return (
    <mesh
      position={[(geometry.cueBall.x + geometry.ghostBall.x) / 2, ballRadius, (geometry.cueBall.z + geometry.ghostBall.z) / 2]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[ballRadius, ballRadius, length, 48, 1, false]} />
      <meshStandardMaterial color="#8fc7ff" transparent opacity={0.24} roughness={0.38} depthWrite={false} />
    </mesh>
  );
}

function getPostImpactCuePath(geometry: ShotGeometry) {
  const candidate = {
    x: -geometry.objectPath.z,
    z: geometry.objectPath.x
  };
  const alignment = candidate.x * geometry.cuePath.x + candidate.z * geometry.cuePath.z;

  return alignment >= 0 ? candidate : { x: -candidate.x, z: -candidate.z };
}
