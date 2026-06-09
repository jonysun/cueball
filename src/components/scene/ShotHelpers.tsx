import { Line } from '@react-three/drei';
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
  const diameterStart = {
    x: geometry.objectBall.x - perpendicular.x * ballRadius,
    z: geometry.objectBall.z - perpendicular.z * ballRadius
  };
  const diameterEnd = {
    x: geometry.objectBall.x + perpendicular.x * ballRadius,
    z: geometry.objectBall.z + perpendicular.z * ballRadius
  };
  const overlapEnd = {
    x: diameterStart.x + perpendicular.x * geometry.overlapLength,
    z: diameterStart.z + perpendicular.z * geometry.overlapLength
  };

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
        <Line
          points={[point(geometry.cueBall.x, geometry.cueBall.z, 0.006), point(geometry.ghostBall.x, geometry.ghostBall.z, 0.006)]}
          color="#8fc7ff"
          lineWidth={18}
          transparent
          opacity={0.28}
        />
      )}
      {displayOptions.ghostBall && (
        <Ball position={geometry.ghostBall} radius={ballRadius} color="#d7ecff" name="ghost-ball" opacity={0.38} />
      )}
      {displayOptions.objectDiameter && (
        <Line
          points={[point(diameterStart.x, diameterStart.z, 0.03), point(diameterEnd.x, diameterEnd.z, 0.03)]}
          color="#232a27"
          lineWidth={2}
        />
      )}
      {displayOptions.overlapSegment && (
        <Line
          points={[point(diameterStart.x, diameterStart.z, 0.038), point(overlapEnd.x, overlapEnd.z, 0.038)]}
          color="#d92d20"
          lineWidth={5}
        />
      )}
    </group>
  );
}
