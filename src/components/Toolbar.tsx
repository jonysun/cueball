import { Box, Languages, Lock, Square, Unlock } from 'lucide-react';
import type { Pocket, PocketId } from '../domain/types';
import { translations } from '../i18n';
import type { DisplayOptions, Language, ViewMode } from '../state/defaultState';

type ToolbarProps = {
  pockets: Pocket[];
  selectedPocket: PocketId;
  displayOptions: DisplayOptions;
  language: Language;
  viewMode: ViewMode;
  cameraLocked: boolean;
  cueBallLocked: boolean;
  objectBallLocked: boolean;
  examMode: boolean;
  onLanguageToggle: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleCameraLock: () => void;
  onToggleCueBallLock: () => void;
  onToggleObjectBallLock: () => void;
  onPocketChange: (pocket: PocketId) => void;
  onToggleDisplay: (key: keyof DisplayOptions) => void;
};

const helperKeys: Array<keyof DisplayOptions> = [
  'objectPath',
  'cuePath',
  'cuePathBand',
  'ghostBall',
  'objectDiameter',
  'overlapSegment',
  'diameterProjection',
  'postImpactCuePath',
  'cueProjection',
  'cutAngle'
];

export function Toolbar({
  pockets,
  selectedPocket,
  displayOptions,
  language,
  viewMode,
  cameraLocked,
  cueBallLocked,
  objectBallLocked,
  examMode,
  onLanguageToggle,
  onViewModeChange,
  onToggleCameraLock,
  onToggleCueBallLock,
  onToggleObjectBallLock,
  onPocketChange,
  onToggleDisplay
}: ToolbarProps) {
  const t = translations[language];

  return (
    <div className="toolbar">
      <div className="quick-controls">
        <button
          className="tool-button"
          type="button"
          aria-label={t.languageToggleAria}
          onClick={onLanguageToggle}
        >
          <Languages aria-hidden="true" size={18} />
          <span>{t.languageToggle}</span>
        </button>

        <div className="segmented compact" role="group" aria-label={t.viewMode}>
          <button
            className={viewMode === '3d' ? 'active' : ''}
            type="button"
            aria-pressed={viewMode === '3d'}
            onClick={() => onViewModeChange('3d')}
          >
            <Box aria-hidden="true" size={17} />
            <span>{t.view3d}</span>
          </button>
          <button
            className={viewMode === '2d' ? 'active' : ''}
            type="button"
            aria-pressed={viewMode === '2d'}
            onClick={() => onViewModeChange('2d')}
          >
            <Square aria-hidden="true" size={17} />
            <span>{t.view2d}</span>
          </button>
        </div>

        <button
          className={cameraLocked ? 'tool-button active' : 'tool-button'}
          type="button"
          aria-label={cameraLocked ? t.cameraUnlockAria : t.cameraLockAria}
          aria-pressed={cameraLocked}
          onClick={onToggleCameraLock}
        >
          {cameraLocked ? <Lock aria-hidden="true" size={18} /> : <Unlock aria-hidden="true" size={18} />}
          <span>{cameraLocked ? t.cameraUnlock : t.cameraLock}</span>
        </button>

        <div className="lock-grid">
          <button
            className={cueBallLocked ? 'tool-button active' : 'tool-button'}
            type="button"
            aria-label={cueBallLocked ? t.cueBallUnlockAria : t.cueBallLockAria}
            aria-pressed={cueBallLocked}
            disabled={examMode}
            onClick={onToggleCueBallLock}
          >
            {cueBallLocked ? <Lock aria-hidden="true" size={18} /> : <Unlock aria-hidden="true" size={18} />}
            <span>{cueBallLocked ? t.cueBallUnlock : t.cueBallLock}</span>
          </button>
          <button
            className={objectBallLocked ? 'tool-button active' : 'tool-button'}
            type="button"
            aria-label={objectBallLocked ? t.objectBallUnlockAria : t.objectBallLockAria}
            aria-pressed={objectBallLocked}
            disabled={examMode}
            onClick={onToggleObjectBallLock}
          >
            {objectBallLocked ? <Lock aria-hidden="true" size={18} /> : <Unlock aria-hidden="true" size={18} />}
            <span>{objectBallLocked ? t.objectBallUnlock : t.objectBallLock}</span>
          </button>
        </div>
      </div>

      <label className="field">
        <span>{t.targetPocket}</span>
        <select
          aria-label={t.targetPocket}
          value={selectedPocket}
          disabled={examMode}
          onChange={(event) => onPocketChange(event.target.value as PocketId)}
        >
          {pockets.map((pocket) => (
            <option key={pocket.id} value={pocket.id}>
              {t.pockets[pocket.id] ?? pocket.label}
            </option>
          ))}
        </select>
      </label>

      <div className="toggle-grid" aria-label={t.helperVisibility}>
        {helperKeys.map((key) => (
          <label key={key} className="toggle-row">
            <input
              type="checkbox"
              checked={displayOptions[key]}
              disabled={examMode}
              onChange={() => onToggleDisplay(key)}
            />
            <span>{t.helpers[key]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
