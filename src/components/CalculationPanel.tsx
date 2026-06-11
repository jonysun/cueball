import type { ShotGeometry } from '../domain/shotGeometry';
import type { Pocket } from '../domain/types';
import { translations } from '../i18n';
import type { ExamDifficulty, ExamResult, Language, PanelMode } from '../state/defaultState';

type CalculationPanelProps = {
  geometry: ShotGeometry;
  selectedPocket: Pocket;
  language: Language;
  mode: PanelMode;
  examMode: boolean;
  examDifficulty: ExamDifficulty;
  examResult: ExamResult | null;
  onModeChange: (mode: PanelMode) => void;
  onExamDifficultyChange: (difficulty: ExamDifficulty) => void;
  onStartExam: () => void;
  onExitExam: () => void;
  onNewExamShot: () => void;
  onConfirmExam: () => void;
};

export function CalculationPanel({
  geometry,
  selectedPocket,
  language,
  mode,
  examMode,
  examDifficulty,
  examResult,
  onModeChange,
  onExamDifficultyChange,
  onStartExam,
  onExitExam,
  onNewExamShot,
  onConfirmExam
}: CalculationPanelProps) {
  const t = translations[language];
  const selectedPocketLabel = t.pockets[selectedPocket.id] ?? selectedPocket.label;

  return (
    <section className="calculation-panel">
      <header className="panel-header">
        <div>
          <h1>{t.appTitle}</h1>
          <p>{examMode ? `${t.examTarget}: ${selectedPocketLabel}` : selectedPocketLabel}</p>
        </div>
        <strong>{examMode ? t.examTitle : `${geometry.coveragePercent.toFixed(1)}%`}</strong>
      </header>

      {examMode ? (
        <ExamPanel
          selectedPocketLabel={selectedPocketLabel}
          difficulty={examDifficulty}
          result={examResult}
          language={language}
          onDifficultyChange={onExamDifficultyChange}
          onConfirm={onConfirmExam}
          onNewShot={onNewExamShot}
          onExit={onExitExam}
        />
      ) : (
        <>
          <dl className="metric-grid">
            <div>
              <dt>{t.cutAngle}</dt>
              <dd>
                {geometry.cutAngleDegrees.toFixed(1)} {t.degrees}
              </dd>
            </div>
            <div>
              <dt>{t.overlap}</dt>
              <dd>
                {(geometry.overlapLength * 1000).toFixed(1)} {t.meters}
              </dd>
            </div>
          </dl>
          <FunctionGraph geometry={geometry} title={t.functionGraphTitle} />
          <ExamLauncher
            difficulty={examDifficulty}
            language={language}
            onDifficultyChange={onExamDifficultyChange}
            onStart={onStartExam}
          />

          <div className="segmented" role="group" aria-label={t.panelMode}>
            <button
              className={mode === 'teaching' ? 'active' : ''}
              type="button"
              onClick={() => onModeChange('teaching')}
            >
              {t.teaching}
            </button>
            <button
              className={mode === 'formula' ? 'active' : ''}
              type="button"
              onClick={() => onModeChange('formula')}
            >
              {t.formula}
            </button>
          </div>

          {mode === 'teaching' ? (
            <TeachingBody steps={t.teachingSteps} />
          ) : (
            <FormulaBody geometry={geometry} language={language} />
          )}

          {geometry.warnings.length > 0 && (
            <div className="warnings" role="status">
              {geometry.warnings.map((warning) => (
                <p key={warning}>{t.warnings[warning] ?? warning}</p>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ExamLauncher({
  difficulty,
  language,
  onDifficultyChange,
  onStart
}: {
  difficulty: ExamDifficulty;
  language: Language;
  onDifficultyChange: (difficulty: ExamDifficulty) => void;
  onStart: () => void;
}) {
  const t = translations[language];

  return (
    <div className="exam-card">
      <div className="exam-card-header">
        <strong>{t.examTitle}</strong>
      </div>
      <DifficultySelector difficulty={difficulty} language={language} onChange={onDifficultyChange} />
      <button className="primary-action" type="button" onClick={onStart}>
        {t.enterExam}
      </button>
    </div>
  );
}

function ExamPanel({
  selectedPocketLabel,
  difficulty,
  result,
  language,
  onDifficultyChange,
  onConfirm,
  onNewShot,
  onExit
}: {
  selectedPocketLabel: string;
  difficulty: ExamDifficulty;
  result: ExamResult | null;
  language: Language;
  onDifficultyChange: (difficulty: ExamDifficulty) => void;
  onConfirm: () => void;
  onNewShot: () => void;
  onExit: () => void;
}) {
  const t = translations[language];

  return (
    <div className="exam-card active">
      <div className="exam-card-header">
        <strong>{t.examTitle}</strong>
        <span>{selectedPocketLabel}</span>
      </div>
      <DifficultySelector difficulty={difficulty} language={language} onChange={onDifficultyChange} />
      <div className="exam-actions">
        <button className="primary-action" type="button" onClick={onConfirm}>
          {t.confirmExam}
        </button>
        <button type="button" onClick={onNewShot}>
          {t.newExamShot}
        </button>
        <button type="button" onClick={onExit}>
          {t.exitExam}
        </button>
      </div>
      {result && <ExamResultView result={result} language={language} />}
    </div>
  );
}

function DifficultySelector({
  difficulty,
  language,
  onChange
}: {
  difficulty: ExamDifficulty;
  language: Language;
  onChange: (difficulty: ExamDifficulty) => void;
}) {
  const t = translations[language];
  const options: ExamDifficulty[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="segmented compact triple" role="group" aria-label={t.examDifficulty}>
      {options.map((option) => (
        <button
          key={option}
          className={difficulty === option ? 'active' : ''}
          type="button"
          aria-pressed={difficulty === option}
          onClick={() => onChange(option)}
        >
          {t[option]}
        </button>
      ))}
    </div>
  );
}

function ExamResultView({ result, language }: { result: ExamResult; language: Language }) {
  const t = translations[language];

  return (
    <div className="exam-result" role="status">
      <div className="exam-result-heading">
        <strong>{t.examResult}</strong>
        <span className={`rating ${result.rating}`}>{t.rating[result.rating]}</span>
      </div>
      <dl className="result-grid">
        <div>
          <dt>{t.userAim}</dt>
          <dd>{result.userCoveragePercent.toFixed(1)}%</dd>
        </div>
        <div>
          <dt>{t.theoryAim}</dt>
          <dd>{result.theoreticalCoveragePercent.toFixed(1)}%</dd>
        </div>
        <div>
          <dt>{t.userOverlap}</dt>
          <dd>
            {result.userOverlapMm.toFixed(1)} {t.meters}
          </dd>
        </div>
        <div>
          <dt>{t.theoryOverlap}</dt>
          <dd>
            {result.theoreticalOverlapMm.toFixed(1)} {t.meters}
          </dd>
        </div>
        <div>
          <dt>{t.difference}</dt>
          <dd>{result.differencePercent.toFixed(2)}%</dd>
        </div>
      </dl>
    </div>
  );
}

function FunctionGraph({ geometry, title }: { geometry: ShotGeometry; title: string }) {
  const width = 280;
  const height = 82;
  const paddingX = 24;
  const paddingY = 12;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;
  const points = Array.from({ length: 37 }, (_, index) => {
    const degrees = (index / 36) * 90;
    const radians = (degrees * Math.PI) / 180;
    const coverage = Math.max(0, 1 - Math.sin(radians));
    const x = paddingX + (degrees / 90) * plotWidth;
    const y = paddingY + (1 - coverage) * plotHeight;

    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  const clampedAngle = Math.min(90, Math.max(0, geometry.cutAngleDegrees));
  const markerCoverage = Math.max(0, Math.min(1, geometry.coverage));
  const markerX = paddingX + (clampedAngle / 90) * plotWidth;
  const markerY = paddingY + (1 - markerCoverage) * plotHeight;

  return (
    <div className="function-card" aria-label={title}>
      <div className="function-card-header">
        <strong>{title}</strong>
        <span>{geometry.coverage.toFixed(3)}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
        <line className="function-axis" x1={paddingX} x2={paddingX} y1={paddingY} y2={height - paddingY} />
        <line
          className="function-axis"
          x1={paddingX}
          x2={width - paddingX}
          y1={height - paddingY}
          y2={height - paddingY}
        />
        <polyline className="function-line" points={points} />
        <circle className="function-marker" cx={markerX} cy={markerY} r="4.5" />
      </svg>
    </div>
  );
}

function TeachingBody({ steps }: { steps: string[] }) {
  return (
    <ol className="teaching-list">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}

function FormulaBody({ geometry, language }: { geometry: ShotGeometry; language: Language }) {
  const t = translations[language];

  return (
    <div className="formula-panel">
      <code>objectPath = normalize(pocket - objectBall)</code>
      <code>ghostBall = objectBall - objectPath * 2R</code>
      <code>cuePath = normalize(ghostBall - cueBall)</code>
      <code>a = acos(dot(objectPath, cuePath))</code>
      <code>coverage = 1 - sin(a)</code>
      <p>
        {t.currentAngle}: {geometry.cutAngleDegrees.toFixed(3)} {t.degrees}
      </p>
      <p>
        {t.currentCoverage}: {geometry.coverage.toFixed(4)}
      </p>
    </div>
  );
}
