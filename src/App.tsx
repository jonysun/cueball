import { useEffect, useMemo, useState } from 'react';
import { CalculationPanel } from './components/CalculationPanel';
import { CueProjectionPanel } from './components/CueProjectionPanel';
import { Toolbar } from './components/Toolbar';
import { BilliardsScene } from './components/scene/BilliardsScene';
import { calculateShotGeometry, calculateShotGeometryFromAimTarget } from './domain/shotGeometry';
import type { ShotGeometry } from './domain/shotGeometry';
import { defaultTableSpec, getPocketById } from './domain/tableSpec';
import type { PocketId, TableSpec, Vec2 } from './domain/types';
import { translations } from './i18n';
import {
  type AppState,
  type DisplayOptions,
  type ExamDifficulty,
  type ExamRating,
  type ExamResult,
  type PanelMode,
  type ViewMode,
  defaultAppState
} from './state/defaultState';

export default function App() {
  const [state, setState] = useState<AppState>(defaultAppState);
  const t = translations[state.language];
  const selectedPocket = getPocketById(state.selectedPocket, defaultTableSpec);
  const sceneDisplayOptions = useMemo(
    () => getSceneDisplayOptions(state.displayOptions, state.examMode, state.examDifficulty),
    [state.displayOptions, state.examDifficulty, state.examMode]
  );
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
  const examGeometry = useMemo(
    () =>
      calculateShotGeometryFromAimTarget({
        cueBall: state.cueBall,
        objectBall: state.objectBall,
        pocketCenter: selectedPocket.center,
        spec: defaultTableSpec,
        aimTarget: state.examAimTarget
      }),
    [state.cueBall, state.examAimTarget, state.objectBall, selectedPocket]
  );
  const projectionGeometry = state.examMode ? examGeometry : geometry;
  const showCueProjection = state.examMode
    ? state.examDifficulty === 'beginner'
    : state.displayOptions.cueProjection;

  useEffect(() => {
    document.title = t.documentTitle;
  }, [t.documentTitle]);

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

  function toggleLanguage() {
    setState((current) => ({
      ...current,
      language: current.language === 'zh' ? 'en' : 'zh'
    }));
  }

  function setViewMode(viewMode: ViewMode) {
    setState((current) => ({ ...current, viewMode }));
  }

  function toggleCameraLock() {
    setState((current) => ({ ...current, cameraLocked: !current.cameraLocked }));
  }

  function toggleCueBallLock() {
    setState((current) => ({ ...current, cueBallLocked: !current.cueBallLocked }));
  }

  function toggleObjectBallLock() {
    setState((current) => ({ ...current, objectBallLocked: !current.objectBallLocked }));
  }

  function setExamDifficulty(examDifficulty: ExamDifficulty) {
    if (state.examMode) {
      startExam(examDifficulty);
      return;
    }

    setState((current) => ({ ...current, examDifficulty }));
  }

  function startExam(examDifficulty: ExamDifficulty = state.examDifficulty) {
    const shot = createRandomExamShot(defaultTableSpec);
    const pocket = getPocketById(shot.selectedPocket, defaultTableSpec);
    const theoreticalGeometry = calculateShotGeometry({
      cueBall: shot.cueBall,
      objectBall: shot.objectBall,
      pocketCenter: pocket.center,
      spec: defaultTableSpec
    });

    setState((current) => ({
      ...current,
      ...shot,
      examMode: true,
      examDifficulty,
      examAimTarget: createInitialExamAimTarget(
        shot.cueBall,
        theoreticalGeometry,
        pocket.center,
        defaultTableSpec,
        examDifficulty
      ),
      examResult: null,
      panelMode: 'teaching',
      cueBallLocked: true,
      objectBallLocked: true
    }));
  }

  function exitExam() {
    setState((current) => ({
      ...current,
      examMode: false,
      examResult: null,
      cueBallLocked: false,
      objectBallLocked: false
    }));
  }

  function confirmExam() {
    const differencePercent = Math.abs(examGeometry.coveragePercent - geometry.coveragePercent);
    const result: ExamResult = {
      userCoveragePercent: examGeometry.coveragePercent,
      theoreticalCoveragePercent: geometry.coveragePercent,
      userOverlapMm: examGeometry.overlapLength * 1000,
      theoreticalOverlapMm: geometry.overlapLength * 1000,
      differencePercent,
      rating: getExamRating(differencePercent)
    };

    setState((current) => ({ ...current, examResult: result }));
  }

  function setCueBall(cueBall: Vec2) {
    setState((current) => ({ ...current, cueBall }));
  }

  function setObjectBall(objectBall: Vec2) {
    setState((current) => ({ ...current, objectBall }));
  }

  function setExamAimTarget(examAimTarget: Vec2) {
    setState((current) => ({ ...current, examAimTarget, examResult: null }));
  }

  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="3D billiards aiming scene">
        <BilliardsScene
          spec={defaultTableSpec}
          geometry={geometry}
          displayOptions={sceneDisplayOptions}
          viewMode={state.viewMode}
          cameraLocked={state.cameraLocked}
          cueBallLocked={state.cueBallLocked || state.examMode}
          objectBallLocked={state.objectBallLocked || state.examMode}
          examMode={state.examMode}
          examAimTarget={state.examAimTarget}
          onCueBallChange={setCueBall}
          onObjectBallChange={setObjectBall}
          onExamAimTargetChange={setExamAimTarget}
        />
        {showCueProjection && (
          <CueProjectionPanel
            geometry={projectionGeometry}
            ballRadius={defaultTableSpec.ballRadius}
            language={state.language}
          />
        )}
      </section>
      <aside className="side-panel" aria-label="Shot calculation panel">
        <CalculationPanel
          geometry={geometry}
          selectedPocket={selectedPocket}
          language={state.language}
          mode={state.panelMode}
          examMode={state.examMode}
          examDifficulty={state.examDifficulty}
          examResult={state.examResult}
          onModeChange={setPanelMode}
          onExamDifficultyChange={setExamDifficulty}
          onStartExam={() => startExam()}
          onExitExam={exitExam}
          onNewExamShot={() => startExam(state.examDifficulty)}
          onConfirmExam={confirmExam}
        />
        <Toolbar
          pockets={defaultTableSpec.pockets}
          selectedPocket={state.selectedPocket}
          displayOptions={state.displayOptions}
          language={state.language}
          viewMode={state.viewMode}
          cameraLocked={state.cameraLocked}
          cueBallLocked={state.cueBallLocked || state.examMode}
          objectBallLocked={state.objectBallLocked || state.examMode}
          examMode={state.examMode}
          onLanguageToggle={toggleLanguage}
          onViewModeChange={setViewMode}
          onToggleCameraLock={toggleCameraLock}
          onToggleCueBallLock={toggleCueBallLock}
          onToggleObjectBallLock={toggleObjectBallLock}
          onPocketChange={setSelectedPocket}
          onToggleDisplay={toggleDisplay}
        />
      </aside>
    </main>
  );
}

function getSceneDisplayOptions(
  displayOptions: DisplayOptions,
  examMode: boolean,
  examDifficulty: ExamDifficulty
): DisplayOptions {
  if (!examMode) {
    return displayOptions;
  }

  return {
    objectPath: examDifficulty !== 'advanced',
    cuePath: false,
    cuePathBand: false,
    ghostBall: false,
    objectDiameter: false,
    overlapSegment: false,
    diameterProjection: false,
    cueProjection: false,
    postImpactCuePath: false,
    cutAngle: false
  };
}

const pocketIds: PocketId[] = ['corner-nw', 'middle-n', 'corner-ne', 'corner-sw', 'middle-s', 'corner-se'];
const maxPossibleCutAngleDegrees = 90;
const minExamBallDistanceMultiplier = 5;
const minExamObjectPocketDistance = 0.34;

function createRandomExamShot(spec: TableSpec) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const selectedPocket = pocketIds[Math.floor(Math.random() * pocketIds.length)];
    const pocket = getPocketById(selectedPocket, spec);
    const objectBall = randomPoint(spec);
    const cueBall = randomPoint(spec);
    const geometry = calculateShotGeometry({
      cueBall,
      objectBall,
      pocketCenter: pocket.center,
      spec
    });
    const ballDistance = Math.hypot(cueBall.x - objectBall.x, cueBall.z - objectBall.z);
    const pocketDistance = Math.hypot(objectBall.x - pocket.center.x, objectBall.z - pocket.center.z);

    if (isPossibleExamShot(geometry, ballDistance, pocketDistance, spec)) {
      return { cueBall, objectBall, selectedPocket };
    }
  }

  return {
    cueBall: { x: -0.55, z: 0.22 },
    objectBall: { x: 0.22, z: -0.08 },
    selectedPocket: 'corner-ne' as PocketId
  };
}

function isPossibleExamShot(
  geometry: ShotGeometry,
  ballDistance: number,
  pocketDistance: number,
  spec: TableSpec
): boolean {
  const cuePathFacesObjectPath = geometry.objectPath.x * geometry.cuePath.x + geometry.objectPath.z * geometry.cuePath.z >= 0;

  return (
    geometry.valid &&
    cuePathFacesObjectPath &&
    geometry.cutAngleDegrees <= maxPossibleCutAngleDegrees &&
    ballDistance > spec.ballDiameter * minExamBallDistanceMultiplier &&
    pocketDistance > minExamObjectPocketDistance
  );
}

function randomPoint(spec: TableSpec): Vec2 {
  const { minX, maxX, minZ, maxZ } = spec.playableBounds;

  return {
    x: minX + Math.random() * (maxX - minX),
    z: minZ + Math.random() * (maxZ - minZ)
  };
}

function createInitialExamAimTarget(
  cueBall: Vec2,
  theoreticalGeometry: ShotGeometry,
  pocketCenter: Vec2,
  spec: TableSpec,
  difficulty: ExamDifficulty
): Vec2 {
  const ghostBall = theoreticalGeometry.ghostBall;
  const dx = ghostBall.x - cueBall.x;
  const dz = ghostBall.z - cueBall.z;
  const length = Math.hypot(dx, dz) || 1;
  const base = theoreticalGeometry.cuePath;
  const maxOffsetDegrees = difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 18 : 26;
  const targetLength = Math.max(0.52, Math.min(0.95, length));

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const offset = ((Math.random() * 2 - 1) * maxOffsetDegrees * Math.PI) / 180;
    const target = targetFromDirection(cueBall, rotateDirection(base, offset), targetLength);
    const candidate = calculateShotGeometryFromAimTarget({
      cueBall,
      objectBall: theoreticalGeometry.objectBall,
      pocketCenter,
      spec,
      aimTarget: target
    });

    if (isPossibleAimGeometry(candidate)) {
      return target;
    }
  }

  return targetFromDirection(cueBall, base, targetLength);
}

function isPossibleAimGeometry(geometry: ShotGeometry): boolean {
  const cuePathFacesObjectPath = geometry.objectPath.x * geometry.cuePath.x + geometry.objectPath.z * geometry.cuePath.z >= 0;

  return geometry.valid && cuePathFacesObjectPath && geometry.cutAngleDegrees <= maxPossibleCutAngleDegrees;
}

function rotateDirection(direction: Vec2, radians: number): Vec2 {
  return {
    x: direction.x * Math.cos(radians) - direction.z * Math.sin(radians),
    z: direction.x * Math.sin(radians) + direction.z * Math.cos(radians)
  };
}

function targetFromDirection(origin: Vec2, direction: Vec2, length: number): Vec2 {
  return {
    x: origin.x + direction.x * length,
    z: origin.z + direction.z * length
  };
}

function getExamRating(differencePercent: number): ExamRating {
  if (differencePercent < 1) {
    return 'perfect';
  }

  if (differencePercent <= 3) {
    return 'very-good';
  }

  if (differencePercent <= 5) {
    return 'good';
  }

  return 'try-again';
}
