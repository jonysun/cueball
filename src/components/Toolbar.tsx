import type { Pocket, PocketId } from '../domain/types';
import type { DisplayOptions } from '../state/defaultState';

type ToolbarProps = {
  pockets: Pocket[];
  selectedPocket: PocketId;
  displayOptions: DisplayOptions;
  onPocketChange: (pocket: PocketId) => void;
  onToggleDisplay: (key: keyof DisplayOptions) => void;
};

const helperLabels: Array<[keyof DisplayOptions, string]> = [
  ['objectPath', 'Object path'],
  ['cuePath', 'Cue path'],
  ['cuePathBand', 'Cue path band'],
  ['ghostBall', 'Ghost ball'],
  ['objectDiameter', 'Object diameter'],
  ['overlapSegment', 'Overlap segment']
];

export function Toolbar({
  pockets,
  selectedPocket,
  displayOptions,
  onPocketChange,
  onToggleDisplay
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <label className="field">
        <span>Target pocket</span>
        <select
          aria-label="Target pocket"
          value={selectedPocket}
          onChange={(event) => onPocketChange(event.target.value as PocketId)}
        >
          {pockets.map((pocket) => (
            <option key={pocket.id} value={pocket.id}>
              {pocket.label}
            </option>
          ))}
        </select>
      </label>

      <div className="toggle-grid" aria-label="Helper visibility">
        {helperLabels.map(([key, label]) => (
          <label key={key} className="toggle-row">
            <input
              type="checkbox"
              checked={displayOptions[key]}
              onChange={() => onToggleDisplay(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
