# Cueball Aiming Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first version of a React Three Fiber 3D billiards aiming teaching simulator with true-scale table geometry and linear path-overlap aiming percentage.

**Architecture:** The app separates pure billiards geometry from React UI and 3D rendering. `src/domain` owns table dimensions, vector math, and shot calculations; React components render controls, the calculation panel, and a Three.js scene from the same derived geometry.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, Three.js, `@react-three/fiber`, `@react-three/drei`.

---

## File Structure

- `package.json`: scripts and dependencies.
- `index.html`: Vite entry document.
- `tsconfig.json`, `vite.config.ts`: TypeScript and Vite configuration.
- `src/main.tsx`: React app entry.
- `src/App.tsx`: application state assembly and layout.
- `src/App.css`: app shell, side panel, toolbar, and responsive layout styles.
- `src/test/setup.ts`: Vitest DOM setup.
- `src/domain/types.ts`: shared domain types.
- `src/domain/vector.ts`: small pure 2D vector utilities for table-plane calculations.
- `src/domain/tableSpec.ts`: real-scale table constants, pocket coordinates, playable bounds.
- `src/domain/shotGeometry.ts`: ghost ball, cut angle, coverage, and warnings.
- `src/domain/tableSpec.test.ts`: unit tests for dimensions and pocket layout.
- `src/domain/shotGeometry.test.ts`: unit tests for formula and edge cases.
- `src/state/defaultState.ts`: initial ball positions and UI display options.
- `src/components/Toolbar.tsx`: pocket selector and helper toggles.
- `src/components/CalculationPanel.tsx`: teaching and formula display modes.
- `src/components/scene/BilliardsScene.tsx`: Canvas, camera, lights, table, balls, and helpers.
- `src/components/scene/TableModel.tsx`: table surface, rails, and pockets.
- `src/components/scene/Ball.tsx`: reusable ball mesh.
- `src/components/scene/ShotHelpers.tsx`: object path, cue path, band, ghost ball, diameter, overlap segment.
- `src/components/scene/DragControls.tsx`: pointer interactions for moving balls on the table plane.
- `src/App.test.tsx`: UI tests for panel mode and helper toggles.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "cueball-aiming-simulator",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^10.0.0",
    "@react-three/fiber": "^9.0.0",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.171.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "@types/three": "^0.171.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: `node_modules/` and `package-lock.json` are created without dependency resolution errors.

- [ ] **Step 3: Create Vite and TypeScript config**

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cueball Aiming Simulator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vite.config.ts"]
}
```

`vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true
  }
});
```

- [ ] **Step 4: Create the initial React shell**

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="3D billiards aiming scene">
        <div className="scene-empty">3D aiming scene loading</div>
      </section>
      <aside className="side-panel" aria-label="Shot calculation panel">
        <h1>Cueball Aiming</h1>
        <p>Geometry-first cut-shot simulator.</p>
      </aside>
    </main>
  );
}
```

`src/App.css`:

```css
:root {
  color: #17201c;
  background: #edf1ee;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
select {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  min-height: 100vh;
  background: #edf1ee;
}

.scene-region {
  min-width: 0;
  min-height: 100vh;
  background: #10221d;
}

.scene-empty {
  display: grid;
  min-height: 100vh;
  place-items: center;
  color: #f4f8f5;
}

.side-panel {
  border-left: 1px solid #c7d0ca;
  background: #f8faf8;
  padding: 20px;
}

.side-panel h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.side-panel p {
  margin: 0;
  color: #596860;
}

@media (max-width: 860px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(420px, 62vh) auto;
  }

  .scene-region,
  .scene-empty {
    min-height: 420px;
  }

  .side-panel {
    border-left: 0;
    border-top: 1px solid #c7d0ca;
  }
}
```

- [ ] **Step 5: Run scaffold verification**

Run: `npm test`

Expected: PASS with no test files found only if Vitest reports no test suites; if Vitest exits non-zero for no tests, proceed after `npm run build` passes.

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 6: Commit scaffold**

```bash
git add package.json package-lock.json index.html tsconfig.json vite.config.ts src
git commit -m "feat: scaffold React Three Fiber app"
```

---

### Task 2: Real-Scale Table Specification

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/tableSpec.ts`
- Create: `src/domain/tableSpec.test.ts`

- [ ] **Step 1: Write failing table spec tests**

`src/domain/tableSpec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { defaultTableSpec, getPocketById, mmToMeters } from './tableSpec';

describe('tableSpec', () => {
  it('converts millimeters to meters', () => {
    expect(mmToMeters(2542)).toBeCloseTo(2.542, 6);
    expect(mmToMeters(57.2)).toBeCloseTo(0.0572, 6);
  });

  it('uses the referenced true-scale table dimensions', () => {
    expect(defaultTableSpec.innerLength).toBeCloseTo(2.542, 6);
    expect(defaultTableSpec.innerWidth).toBeCloseTo(1.262, 6);
    expect(defaultTableSpec.outerLength).toBeCloseTo(2.826, 6);
    expect(defaultTableSpec.outerWidth).toBeCloseTo(1.546, 6);
    expect(defaultTableSpec.height).toBeCloseTo(0.848, 6);
    expect(defaultTableSpec.ballRadius).toBeCloseTo(0.0286, 6);
  });

  it('places six pockets around the inner playfield', () => {
    expect(defaultTableSpec.pockets).toHaveLength(6);
    expect(getPocketById('corner-ne').center).toEqual({
      x: defaultTableSpec.innerLength / 2,
      z: -defaultTableSpec.innerWidth / 2
    });
    expect(getPocketById('middle-s').opening).toBeCloseTo(0.086, 6);
    expect(getPocketById('corner-sw').opening).toBeCloseTo(0.132, 6);
  });

  it('defines playable bounds that keep ball centers inside the cushions', () => {
    expect(defaultTableSpec.playableBounds.minX).toBeCloseTo(
      -defaultTableSpec.innerLength / 2 + defaultTableSpec.ballRadius,
      6
    );
    expect(defaultTableSpec.playableBounds.maxZ).toBeCloseTo(
      defaultTableSpec.innerWidth / 2 - defaultTableSpec.ballRadius,
      6
    );
  });
});
```

- [ ] **Step 2: Run table spec tests to verify failure**

Run: `npm test -- src/domain/tableSpec.test.ts`

Expected: FAIL because `src/domain/tableSpec.ts` does not exist.

- [ ] **Step 3: Implement domain types and table spec**

`src/domain/types.ts`:

```ts
export type PocketId =
  | 'corner-nw'
  | 'middle-n'
  | 'corner-ne'
  | 'corner-sw'
  | 'middle-s'
  | 'corner-se';

export type Vec2 = {
  x: number;
  z: number;
};

export type Bounds2 = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type Pocket = {
  id: PocketId;
  label: string;
  center: Vec2;
  opening: number;
  kind: 'corner' | 'middle';
};

export type TableSpec = {
  innerLength: number;
  innerWidth: number;
  outerLength: number;
  outerWidth: number;
  height: number;
  ballDiameter: number;
  ballRadius: number;
  cornerPocketOpening: number;
  middlePocketOpening: number;
  playableBounds: Bounds2;
  pockets: Pocket[];
};
```

`src/domain/tableSpec.ts`:

```ts
import type { Bounds2, Pocket, PocketId, TableSpec } from './types';

export function mmToMeters(mm: number): number {
  return mm / 1000;
}

const innerLength = mmToMeters(2542);
const innerWidth = mmToMeters(1262);
const outerLength = mmToMeters(2826);
const outerWidth = mmToMeters(1546);
const height = mmToMeters(848);
const ballDiameter = mmToMeters(57.2);
const ballRadius = ballDiameter / 2;
const cornerPocketOpening = mmToMeters(132);
const middlePocketOpening = mmToMeters(86);

const halfLength = innerLength / 2;
const halfWidth = innerWidth / 2;

const playableBounds: Bounds2 = {
  minX: -halfLength + ballRadius,
  maxX: halfLength - ballRadius,
  minZ: -halfWidth + ballRadius,
  maxZ: halfWidth - ballRadius
};

const pockets: Pocket[] = [
  {
    id: 'corner-nw',
    label: 'Northwest corner',
    center: { x: -halfLength, z: -halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'middle-n',
    label: 'North middle',
    center: { x: 0, z: -halfWidth },
    opening: middlePocketOpening,
    kind: 'middle'
  },
  {
    id: 'corner-ne',
    label: 'Northeast corner',
    center: { x: halfLength, z: -halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'corner-sw',
    label: 'Southwest corner',
    center: { x: -halfLength, z: halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  },
  {
    id: 'middle-s',
    label: 'South middle',
    center: { x: 0, z: halfWidth },
    opening: middlePocketOpening,
    kind: 'middle'
  },
  {
    id: 'corner-se',
    label: 'Southeast corner',
    center: { x: halfLength, z: halfWidth },
    opening: cornerPocketOpening,
    kind: 'corner'
  }
];

export const defaultTableSpec: TableSpec = {
  innerLength,
  innerWidth,
  outerLength,
  outerWidth,
  height,
  ballDiameter,
  ballRadius,
  cornerPocketOpening,
  middlePocketOpening,
  playableBounds,
  pockets
};

export function getPocketById(id: PocketId, spec: TableSpec = defaultTableSpec): Pocket {
  const pocket = spec.pockets.find((candidate) => candidate.id === id);

  if (!pocket) {
    throw new Error(`Unknown pocket id: ${id}`);
  }

  return pocket;
}
```

- [ ] **Step 4: Run table spec tests**

Run: `npm test -- src/domain/tableSpec.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit table spec**

```bash
git add src/domain/types.ts src/domain/tableSpec.ts src/domain/tableSpec.test.ts
git commit -m "feat: add true-scale table specification"
```

---

### Task 3: Shot Geometry Core

**Files:**
- Create: `src/domain/vector.ts`
- Create: `src/domain/shotGeometry.ts`
- Create: `src/domain/shotGeometry.test.ts`

- [ ] **Step 1: Write failing shot geometry tests**

`src/domain/shotGeometry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { calculateShotGeometry } from './shotGeometry';
import { defaultTableSpec } from './tableSpec';
import type { Vec2 } from './types';

const spec = defaultTableSpec;
const R = spec.ballRadius;

function geometryForAngle(degrees: number) {
  const objectBall: Vec2 = { x: 0, z: 0 };
  const pocketCenter: Vec2 = { x: 1, z: 0 };
  const ghostBall: Vec2 = { x: -2 * R, z: 0 };
  const distance = 0.6;
  const radians = (degrees * Math.PI) / 180;
  const cueBall: Vec2 = {
    x: ghostBall.x - Math.cos(radians) * distance,
    z: ghostBall.z - Math.sin(radians) * distance
  };

  return calculateShotGeometry({ cueBall, objectBall, pocketCenter, spec });
}

describe('calculateShotGeometry', () => {
  it('returns 100 percent coverage for a straight shot', () => {
    const result = geometryForAngle(0);

    expect(result.valid).toBe(true);
    expect(result.cutAngleDegrees).toBeCloseTo(0, 5);
    expect(result.coverage).toBeCloseTo(1, 5);
  });

  it('returns 50 percent coverage for a 30 degree cut', () => {
    const result = geometryForAngle(30);

    expect(result.valid).toBe(true);
    expect(result.cutAngleDegrees).toBeCloseTo(30, 5);
    expect(result.coverage).toBeCloseTo(0.5, 5);
  });

  it('returns 0 percent coverage for a 90 degree cut', () => {
    const result = geometryForAngle(90);

    expect(result.cutAngleDegrees).toBeCloseTo(90, 5);
    expect(result.coverage).toBeCloseTo(0, 5);
  });

  it('marks cuts over 90 degrees invalid and clamps coverage to zero', () => {
    const result = geometryForAngle(110);

    expect(result.valid).toBe(false);
    expect(result.coverage).toBe(0);
    expect(result.warnings).toContain('Cut angle is over 90 degrees, so the direct pot geometry is invalid.');
  });

  it('warns when cue ball and object ball overlap', () => {
    const result = calculateShotGeometry({
      cueBall: { x: 0.02, z: 0 },
      objectBall: { x: 0, z: 0 },
      pocketCenter: { x: 1, z: 0 },
      spec
    });

    expect(result.warnings).toContain('Cue ball and object ball overlap.');
  });

  it('marks object path invalid when object ball is at the pocket center', () => {
    const result = calculateShotGeometry({
      cueBall: { x: -0.4, z: 0 },
      objectBall: { x: 1, z: 0 },
      pocketCenter: { x: 1, z: 0 },
      spec
    });

    expect(result.valid).toBe(false);
    expect(result.warnings).toContain('Object ball is too close to the selected pocket.');
  });
});
```

- [ ] **Step 2: Run shot geometry tests to verify failure**

Run: `npm test -- src/domain/shotGeometry.test.ts`

Expected: FAIL because `src/domain/shotGeometry.ts` does not exist.

- [ ] **Step 3: Implement vector utilities**

`src/domain/vector.ts`:

```ts
import type { Bounds2, Vec2 } from './types';

export const EPSILON = 1e-6;

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, z: a.z + b.z };
}

export function subtract(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, z: a.z - b.z };
}

export function scale(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, z: v.z * scalar };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.z * b.z;
}

export function length(v: Vec2): number {
  return Math.hypot(v.x, v.z);
}

export function distance(a: Vec2, b: Vec2): number {
  return length(subtract(a, b));
}

export function normalize(v: Vec2): Vec2 | null {
  const magnitude = length(v);

  if (magnitude < EPSILON) {
    return null;
  }

  return { x: v.x / magnitude, z: v.z / magnitude };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampVecToBounds(point: Vec2, bounds: Bounds2): Vec2 {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    z: clamp(point.z, bounds.minZ, bounds.maxZ)
  };
}
```

- [ ] **Step 4: Implement shot geometry**

`src/domain/shotGeometry.ts`:

```ts
import type { TableSpec, Vec2 } from './types';
import { add, clamp, distance, dot, normalize, scale, subtract } from './vector';

export type ShotGeometryInput = {
  cueBall: Vec2;
  objectBall: Vec2;
  pocketCenter: Vec2;
  spec: TableSpec;
};

export type ShotGeometry = {
  valid: boolean;
  cueBall: Vec2;
  objectBall: Vec2;
  pocketCenter: Vec2;
  objectPath: Vec2;
  ghostBall: Vec2;
  cuePath: Vec2;
  cutAngleRadians: number;
  cutAngleDegrees: number;
  coverage: number;
  coveragePercent: number;
  overlapLength: number;
  warnings: string[];
};

const ZERO: Vec2 = { x: 0, z: 0 };

export function calculateShotGeometry(input: ShotGeometryInput): ShotGeometry {
  const warnings: string[] = [];
  let valid = true;

  if (distance(input.cueBall, input.objectBall) < input.spec.ballDiameter) {
    warnings.push('Cue ball and object ball overlap.');
  }

  const objectPath = normalize(subtract(input.pocketCenter, input.objectBall));

  if (!objectPath) {
    warnings.push('Object ball is too close to the selected pocket.');
    return invalidGeometry(input, warnings);
  }

  const ghostBall = add(input.objectBall, scale(objectPath, -input.spec.ballDiameter));
  const cuePath = normalize(subtract(ghostBall, input.cueBall));

  if (!cuePath) {
    warnings.push('Cue ball is too close to the ghost ball.');
    return invalidGeometry(input, warnings, objectPath, ghostBall);
  }

  const cosine = clamp(dot(objectPath, cuePath), -1, 1);
  const cutAngleRadians = Math.acos(cosine);
  const cutAngleDegrees = (cutAngleRadians * 180) / Math.PI;

  if (cutAngleDegrees > 90) {
    warnings.push('Cut angle is over 90 degrees, so the direct pot geometry is invalid.');
    valid = false;
  }

  const coverage = valid ? clamp(1 - Math.sin(cutAngleRadians), 0, 1) : 0;

  return {
    valid,
    cueBall: input.cueBall,
    objectBall: input.objectBall,
    pocketCenter: input.pocketCenter,
    objectPath,
    ghostBall,
    cuePath,
    cutAngleRadians,
    cutAngleDegrees,
    coverage,
    coveragePercent: coverage * 100,
    overlapLength: coverage * input.spec.ballDiameter,
    warnings
  };
}

function invalidGeometry(
  input: ShotGeometryInput,
  warnings: string[],
  objectPath: Vec2 = ZERO,
  ghostBall: Vec2 = input.objectBall
): ShotGeometry {
  return {
    valid: false,
    cueBall: input.cueBall,
    objectBall: input.objectBall,
    pocketCenter: input.pocketCenter,
    objectPath,
    ghostBall,
    cuePath: ZERO,
    cutAngleRadians: 0,
    cutAngleDegrees: 0,
    coverage: 0,
    coveragePercent: 0,
    overlapLength: 0,
    warnings
  };
}
```

- [ ] **Step 5: Run shot geometry tests**

Run: `npm test -- src/domain/shotGeometry.test.ts`

Expected: PASS.

- [ ] **Step 6: Run all domain tests**

Run: `npm test -- src/domain`

Expected: PASS for `tableSpec.test.ts` and `shotGeometry.test.ts`.

- [ ] **Step 7: Commit geometry core**

```bash
git add src/domain/vector.ts src/domain/shotGeometry.ts src/domain/shotGeometry.test.ts
git commit -m "feat: add linear aiming geometry"
```

---

### Task 4: App State, Toolbar, And Calculation Panel

**Files:**
- Create: `src/state/defaultState.ts`
- Create: `src/components/Toolbar.tsx`
- Create: `src/components/CalculationPanel.tsx`
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write failing UI tests**

`src/App.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows teaching mode by default and switches to formula mode', () => {
    render(<App />);

    expect(screen.getByText('1. Find the object-ball path')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Formula' }));

    expect(screen.getByText(/coverage = 1 - sin/)).toBeInTheDocument();
  });

  it('toggles helper options', () => {
    render(<App />);

    const ghostBallToggle = screen.getByRole('checkbox', { name: 'Ghost ball' });

    expect(ghostBallToggle).toBeChecked();
    fireEvent.click(ghostBallToggle);
    expect(ghostBallToggle).not.toBeChecked();
  });

  it('changes the selected pocket', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Target pocket'), {
      target: { value: 'middle-s' }
    });

    expect(screen.getByText('South middle')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run UI tests to verify failure**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because toolbar and panel components do not exist.

- [ ] **Step 3: Create default state**

`src/state/defaultState.ts`:

```ts
import type { PocketId, Vec2 } from '../domain/types';

export type PanelMode = 'teaching' | 'formula';

export type DisplayOptions = {
  objectPath: boolean;
  cuePath: boolean;
  cuePathBand: boolean;
  ghostBall: boolean;
  objectDiameter: boolean;
  overlapSegment: boolean;
};

export type AppState = {
  cueBall: Vec2;
  objectBall: Vec2;
  selectedPocket: PocketId;
  panelMode: PanelMode;
  displayOptions: DisplayOptions;
};

export const defaultDisplayOptions: DisplayOptions = {
  objectPath: true,
  cuePath: true,
  cuePathBand: true,
  ghostBall: true,
  objectDiameter: true,
  overlapSegment: true
};

export const defaultAppState: AppState = {
  cueBall: { x: -0.55, z: 0.22 },
  objectBall: { x: 0.22, z: -0.08 },
  selectedPocket: 'corner-ne',
  panelMode: 'teaching',
  displayOptions: defaultDisplayOptions
};
```

- [ ] **Step 4: Create toolbar**

`src/components/Toolbar.tsx`:

```tsx
import type { DisplayOptions } from '../state/defaultState';
import type { Pocket, PocketId } from '../domain/types';

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
```

- [ ] **Step 5: Create calculation panel**

`src/components/CalculationPanel.tsx`:

```tsx
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
      <li>1. Find the object-ball path to the selected pocket.</li>
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
```

- [ ] **Step 6: Wire state into `App.tsx`**

`src/App.tsx`:

```tsx
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
```

- [ ] **Step 7: Extend CSS for controls and panel**

Append to `src/App.css`:

```css
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.panel-header strong {
  color: #b42318;
  font-size: 28px;
}

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0 0 18px;
}

.metric-grid div {
  border: 1px solid #d8dfda;
  border-radius: 8px;
  padding: 10px;
  background: #ffffff;
}

.metric-grid dt {
  color: #66756d;
  font-size: 12px;
}

.metric-grid dd {
  margin: 4px 0 0;
  font-weight: 700;
}

.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 18px;
  border: 1px solid #cbd5cf;
  border-radius: 8px;
  padding: 4px;
}

.segmented button {
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #405048;
  padding: 8px 10px;
  cursor: pointer;
}

.segmented button.active {
  background: #143b31;
  color: #ffffff;
}

.teaching-list {
  margin: 0 0 18px;
  padding-left: 0;
  list-style: none;
  color: #30433a;
}

.teaching-list li + li {
  margin-top: 10px;
}

.formula-panel {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.formula-panel code {
  display: block;
  border-radius: 6px;
  background: #ebf0ed;
  padding: 8px;
  color: #21332a;
  white-space: normal;
}

.formula-panel p {
  margin: 0;
}

.warnings {
  border-left: 3px solid #b42318;
  background: #fff4f2;
  padding: 10px 12px;
  color: #812018;
}

.warnings p {
  margin: 0;
}

.warnings p + p {
  margin-top: 6px;
}

.toolbar {
  display: grid;
  gap: 18px;
  margin-top: 22px;
}

.field {
  display: grid;
  gap: 6px;
  color: #405048;
  font-weight: 700;
}

.field select {
  width: 100%;
  border: 1px solid #cbd5cf;
  border-radius: 8px;
  background: #ffffff;
  padding: 9px 10px;
}

.toggle-grid {
  display: grid;
  gap: 8px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 9px;
}
```

- [ ] **Step 8: Run UI tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 9: Run all tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 10: Commit state and panel**

```bash
git add src/state src/components/Toolbar.tsx src/components/CalculationPanel.tsx src/App.tsx src/App.css src/App.test.tsx
git commit -m "feat: add aiming controls and calculation panel"
```

---

### Task 5: 3D Table, Balls, And Helper Rendering

**Files:**
- Create: `src/components/scene/BilliardsScene.tsx`
- Create: `src/components/scene/TableModel.tsx`
- Create: `src/components/scene/Ball.tsx`
- Create: `src/components/scene/ShotHelpers.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Create reusable ball mesh**

`src/components/scene/Ball.tsx`:

```tsx
import type { Vec2 } from '../../domain/types';

type BallProps = {
  position: Vec2;
  radius: number;
  color: string;
  name: string;
  opacity?: number;
};

export function Ball({ position, radius, color, name, opacity = 1 }: BallProps) {
  return (
    <mesh position={[position.x, radius, position.z]} castShadow receiveShadow name={name}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshStandardMaterial color={color} roughness={0.42} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}
```

- [ ] **Step 2: Create table model**

`src/components/scene/TableModel.tsx`:

```tsx
import type { TableSpec } from '../../domain/types';

type TableModelProps = {
  spec: TableSpec;
};

export function TableModel({ spec }: TableModelProps) {
  const railWidthX = (spec.outerLength - spec.innerLength) / 2;
  const railWidthZ = (spec.outerWidth - spec.innerWidth) / 2;
  const railHeight = 0.085;
  const slateHeight = 0.045;

  return (
    <group>
      <mesh position={[0, -slateHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[spec.innerLength, slateHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#176d54" roughness={0.86} />
      </mesh>

      <mesh position={[0, railHeight / 2, -spec.innerWidth / 2 - railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[0, railHeight / 2, spec.innerWidth / 2 + railWidthZ / 2]} castShadow receiveShadow>
        <boxGeometry args={[spec.outerLength, railHeight, railWidthZ]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[-spec.innerLength / 2 - railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>
      <mesh position={[spec.innerLength / 2 + railWidthX / 2, railHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railWidthX, railHeight, spec.innerWidth]} />
        <meshStandardMaterial color="#26342f" roughness={0.7} />
      </mesh>

      {spec.pockets.map((pocket) => (
        <mesh key={pocket.id} position={[pocket.center.x, 0.006, pocket.center.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[pocket.opening / 2, 40]} />
          <meshBasicMaterial color="#050807" />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 3: Create helper rendering**

`src/components/scene/ShotHelpers.tsx`:

```tsx
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
  const cueLineStart = geometry.cueBall;
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
          points={[point(cueLineStart.x, cueLineStart.z, 0.018), point(cueLineEnd.x, cueLineEnd.z, 0.018)]}
          color="#2f6fed"
          lineWidth={3}
        />
      )}
      {displayOptions.cuePathBand && (
        <Line
          points={[point(cueLineStart.x, cueLineStart.z, 0.006), point(geometry.ghostBall.x, geometry.ghostBall.z, 0.006)]}
          color="#8fc7ff"
          lineWidth={18}
          transparent
          opacity={0.28}
        />
      )}
      {displayOptions.ghostBall && <Ball position={geometry.ghostBall} radius={ballRadius} color="#d7ecff" name="ghost-ball" opacity={0.38} />}
      {displayOptions.objectDiameter && (
        <Line points={[point(diameterStart.x, diameterStart.z, 0.03), point(diameterEnd.x, diameterEnd.z, 0.03)]} color="#232a27" lineWidth={2} />
      )}
      {displayOptions.overlapSegment && (
        <Line points={[point(diameterStart.x, diameterStart.z, 0.038), point(overlapEnd.x, overlapEnd.z, 0.038)]} color="#d92d20" lineWidth={5} />
      )}
    </group>
  );
}
```

- [ ] **Step 4: Create scene component**

`src/components/scene/BilliardsScene.tsx`:

```tsx
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { ShotGeometry } from '../../domain/shotGeometry';
import type { TableSpec } from '../../domain/types';
import type { DisplayOptions } from '../../state/defaultState';
import { Ball } from './Ball';
import { ShotHelpers } from './ShotHelpers';
import { TableModel } from './TableModel';

type BilliardsSceneProps = {
  spec: TableSpec;
  geometry: ShotGeometry;
  displayOptions: DisplayOptions;
};

export function BilliardsScene({ spec, geometry, displayOptions }: BilliardsSceneProps) {
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
      <Ball position={geometry.cueBall} radius={spec.ballRadius} color="#f8f9fb" name="cue-ball" />
      <Ball position={geometry.objectBall} radius={spec.ballRadius} color="#c43d32" name="object-ball" />
    </Canvas>
  );
}
```

- [ ] **Step 5: Replace scene shell in `App.tsx`**

Add import:

```tsx
import { BilliardsScene } from './components/scene/BilliardsScene';
```

Replace the `scene-region` content:

```tsx
<section className="scene-region" aria-label="3D billiards aiming scene">
  <BilliardsScene
    spec={defaultTableSpec}
    geometry={geometry}
    displayOptions={state.displayOptions}
  />
</section>
```

- [ ] **Step 6: Add canvas CSS**

Append to `src/App.css`:

```css
.billiards-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 7: Mock the WebGL scene in `App.test.tsx`**

Replace `src/App.test.tsx` with:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/scene/BilliardsScene', () => ({
  BilliardsScene: () => <div data-testid="mock-billiards-scene">Mock 3D scene</div>
}));

describe('App', () => {
  it('shows teaching mode by default and switches to formula mode', () => {
    render(<App />);

    expect(screen.getByText('1. Find the object-ball path')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Formula' }));

    expect(screen.getByText(/coverage = 1 - sin/)).toBeInTheDocument();
  });

  it('toggles helper options', () => {
    render(<App />);

    const ghostBallToggle = screen.getByRole('checkbox', { name: 'Ghost ball' });

    expect(ghostBallToggle).toBeChecked();
    fireEvent.click(ghostBallToggle);
    expect(ghostBallToggle).not.toBeChecked();
  });

  it('changes the selected pocket', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Target pocket'), {
      target: { value: 'middle-s' }
    });

    expect(screen.getByText('South middle')).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run build and tests**

Run: `npm run build`

Expected: PASS.

Run: `npm test`

Expected: PASS.

- [ ] **Step 9: Commit 3D rendering**

```bash
git add src/components/scene src/App.tsx src/App.css src/App.test.tsx
git commit -m "feat: render true-scale billiards scene"
```

---

### Task 6: Ball Dragging And Playable Bounds

**Files:**
- Create: `src/components/scene/DragControls.tsx`
- Modify: `src/components/scene/BilliardsScene.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add ball position update props to scene**

Modify `BilliardsSceneProps` in `src/components/scene/BilliardsScene.tsx`:

```tsx
type BilliardsSceneProps = {
  spec: TableSpec;
  geometry: ShotGeometry;
  displayOptions: DisplayOptions;
  onCueBallChange: (position: Vec2) => void;
  onObjectBallChange: (position: Vec2) => void;
};
```

Add `Vec2` to the imports:

```tsx
import type { TableSpec, Vec2 } from '../../domain/types';
```

- [ ] **Step 2: Create drag plane helper**

`src/components/scene/DragControls.tsx`:

```tsx
import { ThreeEvent } from '@react-three/fiber';
import type { ReactNode } from 'react';
import type { Bounds2, Vec2 } from '../../domain/types';
import { clampVecToBounds } from '../../domain/vector';

type DraggableBallProps = {
  bounds: Bounds2;
  onChange: (position: Vec2) => void;
  children: ReactNode;
};

export function DraggableBall({ bounds, onChange, children }: DraggableBallProps) {
  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (event.buttons !== 1) {
      return;
    }

    event.stopPropagation();
    onChange(clampVecToBounds({ x: event.point.x, z: event.point.z }, bounds));
  }

  return (
    <group onPointerDown={(event) => event.stopPropagation()} onPointerMove={handlePointerMove}>
      {children}
    </group>
  );
}
```

- [ ] **Step 3: Wrap cue ball and object ball with drag controls**

In `src/components/scene/BilliardsScene.tsx`, import `DraggableBall`:

```tsx
import { DraggableBall } from './DragControls';
```

Replace the two solid ball render calls:

```tsx
<DraggableBall bounds={spec.playableBounds} onChange={onCueBallChange}>
  <Ball position={geometry.cueBall} radius={spec.ballRadius} color="#f8f9fb" name="cue-ball" />
</DraggableBall>
<DraggableBall bounds={spec.playableBounds} onChange={onObjectBallChange}>
  <Ball position={geometry.objectBall} radius={spec.ballRadius} color="#c43d32" name="object-ball" />
</DraggableBall>
```

- [ ] **Step 4: Wire position setters in `App.tsx`**

Add `Vec2` import:

```tsx
import type { PocketId, Vec2 } from './domain/types';
```

Add setters:

```tsx
function setCueBall(cueBall: Vec2) {
  setState((current) => ({ ...current, cueBall }));
}

function setObjectBall(objectBall: Vec2) {
  setState((current) => ({ ...current, objectBall }));
}
```

Pass props to `BilliardsScene`:

```tsx
<BilliardsScene
  spec={defaultTableSpec}
  geometry={geometry}
  displayOptions={state.displayOptions}
  onCueBallChange={setCueBall}
  onObjectBallChange={setObjectBall}
/>
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 6: Commit dragging**

```bash
git add src/components/scene/DragControls.tsx src/components/scene/BilliardsScene.tsx src/App.tsx
git commit -m "feat: drag balls within playable bounds"
```

---

### Task 7: Final Verification And Browser Check

**Files:**
- Modify only if verification reveals defects in files from earlier tasks.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: PASS for domain and UI tests.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS and `dist/` is generated.

- [ ] **Step 3: Start development server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a localhost URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser visual verification**

Open the local Vite URL in the in-app browser and verify:

- The 3D canvas is not blank.
- The table proportions appear long and narrow according to the real inner playfield ratio.
- Six pockets are visible.
- Cue ball, object ball, and ghost ball are visible.
- Orbit controls rotate left and right.
- Orbit controls tilt up and down within bounds.
- Helper toggles hide and show matching scene elements.
- Formula mode shows `coverage = 1 - sin(a)`.
- No side-panel text overlaps at desktop width.
- At a narrow viewport, the scene remains usable above the panel.

- [ ] **Step 5: Stop the development server**

Stop the running Vite process with `Ctrl+C` in the terminal session that started it.

- [ ] **Step 6: Commit verification fixes if any files changed**

If verification required edits:

```bash
git add src
git commit -m "fix: polish simulator verification issues"
```

If no files changed, record the verification result in the final implementation response without making a commit.
