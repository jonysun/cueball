import type { ShotGeometry } from '../domain/shotGeometry';
import { translations } from '../i18n';
import type { Language } from '../state/defaultState';

type CueProjectionPanelProps = {
  geometry: ShotGeometry;
  ballRadius: number;
  language: Language;
};

export function CueProjectionPanel({ geometry, ballRadius, language }: CueProjectionPanelProps) {
  const t = translations[language];
  const diameter = ballRadius * 2;
  const svgWidth = 214;
  const svgHeight = 142;
  const centerY = 74;
  const centerX = svgWidth / 2;
  const viewRadius = ballRadius * 3.2;
  const scale = (svgWidth - 44) / (viewRadius * 2);
  const renderedRadius = ballRadius * scale;
  const perpendicular = {
    x: -geometry.cuePath.z,
    z: geometry.cuePath.x
  };
  const objectOffset =
    (geometry.objectBall.x - geometry.ghostBall.x) * perpendicular.x +
    (geometry.objectBall.z - geometry.ghostBall.z) * perpendicular.z;
  const projectionStart = Math.max(-ballRadius, -ballRadius - objectOffset);
  const projectionEnd = Math.min(ballRadius, ballRadius - objectOffset);
  const hasProjection = projectionEnd > projectionStart;

  function xFromOffset(offset: number) {
    return centerX + offset * scale;
  }

  const ghostX = xFromOffset(0);
  const objectX = xFromOffset(objectOffset);
  const objectDiameterStart = objectX - renderedRadius;
  const objectDiameterEnd = objectX + renderedRadius;
  const projectionX1 = xFromOffset(objectOffset + projectionStart);
  const projectionX2 = xFromOffset(objectOffset + projectionEnd);

  return (
    <aside className="cue-projection" aria-label={t.cueProjectionTitle}>
      <div className="cue-projection-header">
        <strong>{t.cueProjectionTitle}</strong>
        <span>{geometry.coveragePercent.toFixed(1)}%</span>
      </div>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-hidden="true" focusable="false">
        <line className="projection-centerline" x1={centerX} x2={centerX} y1="34" y2="116" />
        <circle className="projection-ghost" cx={ghostX} cy={centerY} r={renderedRadius} />
        <circle className="projection-object" cx={objectX} cy={centerY} r={renderedRadius} />
        <line className="projection-diameter" x1={objectDiameterStart} x2={objectDiameterEnd} y1={centerY} y2={centerY} />
        {hasProjection && (
          <line className="projection-overlap" x1={projectionX1} x2={projectionX2} y1={centerY} y2={centerY} />
        )}
        <text x={ghostX} y="128" textAnchor="middle">
          {t.cueProjectionGhost}
        </text>
        <text x={objectX} y="26" textAnchor="middle">
          {t.cueProjectionObject}
        </text>
      </svg>
      <div className="cue-projection-scale">
        {(diameter * 1000).toFixed(1)} {t.meters}
      </div>
    </aside>
  );
}
