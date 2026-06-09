import type { ShotGeometry } from '../domain/shotGeometry';
import type { Pocket } from '../domain/types';
import type { PanelMode } from '../state/defaultState';

type CalculationPanelProps = {
  geometry: ShotGeometry;
  selectedPocket: Pocket;
  mode: PanelMode;
  onModeChange: (mode: PanelMode) => void;
};

export function CalculationPanel({
  geometry,
  selectedPocket,
  mode,
  onModeChange
}: CalculationPanelProps) {
  return (
    <section className="calculation-panel">
      <header className="panel-header">
        <div>
          <h1>Cueball Aiming</h1>
          <p>{selectedPocket.label}</p>
        </div>
        <strong>{geometry.coveragePercent.toFixed(1)}%</strong>
      </header>

      <dl className="metric-grid">
        <div>
          <dt>Cut angle</dt>
          <dd>{geometry.cutAngleDegrees.toFixed(1)} deg</dd>
        </div>
        <div>
          <dt>Overlap</dt>
          <dd>{geometry.overlapLength.toFixed(3)} m</dd>
        </div>
      </dl>

      <div className="segmented" role="group" aria-label="Panel mode">
        <button
          className={mode === 'teaching' ? 'active' : ''}
          type="button"
          onClick={() => onModeChange('teaching')}
        >
          Teaching
        </button>
        <button
          className={mode === 'formula' ? 'active' : ''}
          type="button"
          onClick={() => onModeChange('formula')}
        >
          Formula
        </button>
      </div>

      {mode === 'teaching' ? <TeachingBody /> : <FormulaBody geometry={geometry} />}

      {geometry.warnings.length > 0 && (
        <div className="warnings" role="status">
          {geometry.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
    </section>
  );
}

function TeachingBody() {
  return (
    <ol className="teaching-list">
      <li>1. Find the object-ball path</li>
      <li>2. Place the ghost ball one ball diameter behind the object ball.</li>
      <li>3. Aim the cue ball toward the ghost ball.</li>
      <li>4. Read the linear overlap from the cue path view.</li>
    </ol>
  );
}

function FormulaBody({ geometry }: { geometry: ShotGeometry }) {
  return (
    <div className="formula-panel">
      <code>objectPath = normalize(pocket - objectBall)</code>
      <code>ghostBall = objectBall - objectPath * 2R</code>
      <code>cuePath = normalize(ghostBall - cueBall)</code>
      <code>a = acos(dot(objectPath, cuePath))</code>
      <code>coverage = 1 - sin(a)</code>
      <p>Current a: {geometry.cutAngleDegrees.toFixed(3)} deg</p>
      <p>Current coverage: {geometry.coverage.toFixed(4)}</p>
    </div>
  );
}
