# 3D Cueball Aiming Simulator Design

Date: 2026-06-09

## Goal

Build a 3D billiards aiming teaching simulator focused on ideal straight-line cut-shot geometry. The first version explains how a cue ball should travel to contact an object ball so that the object ball enters a selected pocket.

The app is a geometry teaching tool, not a full physics simulator. It does not model spin, throw, cushion rebounds, rolling friction, or animated collisions in the first version.

## Product Scope

The first screen is the working simulator. It contains a true-scale 3D billiards table, cue ball, object ball, pockets, camera controls, visual helper lines, and a side calculation panel.

Users can:

- Orbit the camera left and right.
- Tilt the camera up and down.
- Select a target pocket.
- Move or set the cue ball and object ball.
- Toggle helper visuals, including the object-ball path, cue-ball path, ghost ball, cue-ball path light band, object-ball reference diameter, and linear overlap segment.
- Switch the side panel between teaching mode and formula mode.

## Technical Approach

Use a Vite + React + TypeScript application.

Use `@react-three/fiber` for the 3D scene and `@react-three/drei` for camera controls and common scene helpers. Keep the geometry calculation code separate from rendering components so formulas can be tested without a browser or WebGL context.

The app has three main layers:

- Scene layer: renders the table, balls, pockets, helper lines, ghost ball, cue path band, and labels.
- Geometry layer: computes all derived shot data from ball positions, selected pocket, and table dimensions.
- UI layer: stores user controls and renders the side panel, toggles, pocket selector, and teaching/formula modes.

## Real-Scale Model

Use meters as the scene unit. Store source dimensions in millimeters and convert them to meters through shared constants.

Default dimensions are based on the referenced standard draft PDF:

- Inner playfield: `2542 x 1262 mm`
- Outer table: `2826 x 1546 mm`
- Table height: `848 mm`
- Corner pocket opening: `132 mm`
- Middle pocket opening: `86 mm`
- Ball diameter: `57.15-57.25 mm`, default rendered as `57.2 mm`

The table, pocket placement, ball radius, and helper geometry all read from the same `tableSpec` object.

Reference: https://www.ttbz.org.cn/upload/file/20241226/6387081313691921169640017.pdf

## Core Geometry

The simulator uses the clarified linear path-overlap definition.

Definitions:

- `R`: ball radius
- `cueBall`: cue ball center
- `objectBall`: object ball center
- `pocketCenter`: selected pocket center
- `objectPath = normalize(pocketCenter - objectBall)`
- `ghostBall = objectBall - objectPath * (2R)`
- `cuePath = normalize(ghostBall - cueBall)`
- `cutAngle = acos(clamp(dot(objectPath, cuePath), -1, 1))`
- `coverage = clamp(1 - sin(cutAngle), 0, 1)`

Interpretation:

The selected pocket and object-ball center define the object-ball path. Extending that path backward by one ball diameter gives the ghost cue ball position at impact. The line from the actual cue ball to the ghost ball is the cue-ball path.

Viewed along the cue-ball path, the cue ball sweeps a path of width one ball diameter. The percentage shown by the app is the cue-ball path's linear overlap with the object ball's diameter perpendicular to the cue path. A straight shot gives `100%`. A `30 deg` cut angle gives `50%`. A `90 deg` cut angle gives `0%`.

The first version does not use projected disk area as the primary percentage. A later version may add an optional area-overlap comparison panel.

## UI Design

The UI is a working tool layout.

The main canvas fills most of the viewport. It shows a real-scale table with muted, readable helper colors:

- Object-ball path: green
- Cue-ball path: blue
- Cue path band: soft blue light band
- Ghost ball: dashed or translucent blue-white ball
- Object reference diameter: neutral line
- Linear overlap segment: red or amber highlight
- Invalid geometry: warning color

The side panel contains:

- Selected pocket
- Cut angle
- Linear overlap percentage
- Teaching/formula segmented control
- Helper visual toggles
- Warning messages for invalid or edge-case geometry

Teaching mode explains the current shot in short steps:

1. Find the object-ball path to the pocket.
2. Place the ghost ball one ball diameter behind the object ball.
3. Aim the cue ball toward the ghost ball.
4. Read the overlap percentage from the cue path view.

Formula mode shows the vectors, ghost-ball equation, cut angle, and `coverage = 1 - sin(a)` with current numeric values.

## State And Data Flow

Minimal source state:

- `cueBall`
- `objectBall`
- `selectedPocket`
- `tableSpec`
- `displayOptions`
- `panelMode`
- `cameraPreference`

Derived state comes from a pure function such as `calculateShotGeometry(state)`.

Rendering components receive derived geometry and display options. They do not duplicate formulas. The side panel also reads the same derived geometry so the scene and numbers always match.

## Edge Cases

Handle these cases explicitly:

- Cue ball is too close to the ghost ball: pause angle calculation and show a message.
- Object ball is too close to the selected pocket center: mark the object path as invalid.
- `cutAngle > 90 deg`: mark the shot as geometrically invalid and clamp coverage to `0`.
- Cue ball and object ball overlap: show a warning.
- Dragged balls leave the playable area: clamp them inside the table bounds.
- Dot products near numeric limits: clamp before `acos` to avoid `NaN`.

## Testing Strategy

Prioritize pure geometry tests:

- Straight shot returns `100%`.
- `30 deg` cut returns `50%`.
- `90 deg` cut returns `0%`.
- Dot-product clamping avoids `NaN`.
- Invalid geometry produces warnings.
- Table constants convert millimeters to meters correctly.
- Ball and pocket dimensions use the same `tableSpec`.

Add UI tests only for high-risk behavior:

- Helper toggles hide and show the expected scene elements.
- Panel mode switches between teaching and formula displays.

Use browser visual verification after implementation to confirm that the 3D canvas renders, the camera can orbit and tilt, and helper lines do not overlap important UI text.

## Out Of Scope For Version 1

- Spin, throw, skid, masse, or side effects.
- Cushion rebounds.
- Full ball collision physics.
- Stroke power and animated rolling.
- Multi-ball layouts.
- Saved lessons or shot history.
- Mobile-specific advanced gestures beyond basic camera interaction.

## Open Extension Points

The design keeps these future additions possible:

- Area-overlap projection comparison.
- Shot presets and saved layouts.
- Multi-ball scenes.
- Animated impact preview.
- Alternative table standards.
- React-level routing for lessons or drills.
