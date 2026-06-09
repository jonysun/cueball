import { useMemo, useState } from 'react';
import { CalculationPanel } from './components/CalculationPanel';
import { Toolbar } from './components/Toolbar';
import { calculateShotGeometry } from './domain/shotGeometry';
import { defaultTableSpec, getPocketById } from './domain/tableSpec';
import type { PocketId } from './domain/types';
import {
  type AppState,
  type DisplayOptions,
  type PanelMode,
  defaultAppState
} from './state/defaultState';

export default function App() {
  const [state, setState] = useState<AppState>(defaultAppState);
  const selectedPocket = getPocketById(state.selectedPocket, defaultTableSpec);
  const geometry = useMemo(
    () =>
      calculateShotGeometry({
        cueBall: state.cueBall,
        objectBall: state.objectBall,
        pocketCenter: selectedPocket.center,
        spec: defaultTableSpec
      }),
    [state.cueBall, state.objectBall, selectedPocket]
  );

  function setSelectedPocket(selectedPocketId: PocketId) {
    setState((current) => ({ ...current, selectedPocket: selectedPocketId }));
  }

  function setPanelMode(panelMode: PanelMode) {
    setState((current) => ({ ...current, panelMode }));
  }

  function toggleDisplay(key: keyof DisplayOptions) {
    setState((current) => ({
      ...current,
      displayOptions: {
        ...current.displayOptions,
        [key]: !current.displayOptions[key]
      }
    }));
  }

  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="3D billiards aiming scene">
        <div className="scene-empty">3D aiming scene loading</div>
      </section>
      <aside className="side-panel" aria-label="Shot calculation panel">
        <CalculationPanel
          geometry={geometry}
          selectedPocket={selectedPocket}
          mode={state.panelMode}
          onModeChange={setPanelMode}
        />
        <Toolbar
          pockets={defaultTableSpec.pockets}
          selectedPocket={state.selectedPocket}
          displayOptions={state.displayOptions}
          onPocketChange={setSelectedPocket}
          onToggleDisplay={toggleDisplay}
        />
      </aside>
    </main>
  );
}
