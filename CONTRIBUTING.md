# Contributing to D_MATH BOOSTER

## Project Philosophy

Keep the project easy to run, inspect, and customize. Prefer browser-native APIs and focused changes over dependencies or broad refactors.

## Architecture

The runtime is intentionally kept in four classic-script files:

| File | Ownership |
| --- | --- |
| `index.html` | Static shell and script order |
| `style.css` | Presentation and responsive layout |
| `content.js` | Public editable data and display metadata |
| `game.js` | Engine and runtime behavior |

`content.js` loads before `game.js`. `game.js` remains one runtime file in this version because it shares screen state, timers, focus callbacks, audio callbacks, queues, score state, and navigation. Do not introduce ES modules, npm, a framework, bundler, transpiler, or a mandatory build step without an explicit architecture decision.

For the public content contract, see [CUSTOMIZE.md](CUSTOMIZE.md). For setup and scope, see [README.md](README.md).

## Content vs Engine Boundary

Keep supported production exercise data in `content.js`. Do not move mathematical source pools back into `game.js`.

Derived data belongs in the engine. Examples include Vieta `p` and `q`, known-root direction, answer sign, pair type, the hidden triangle side, and queue strategy. Do not expose derived mechanics in content solely for convenience.

Adding a topic requires coordinated changes to topic dispatch, validation, source contract, round generation, rendering, answer behavior, preview, timer or input mode where needed, regression coverage, and documentation. Adding Level 4 similarly requires engine support; it is not a content-only change.

## Validation Requirements

Every new public content contract needs:

- Startup validation
- Clear `CONFIG ERROR` output
- Deterministic invalid fixtures
- Runtime compatibility
- Documentation updates

`validateGameConfig()` must remain read-only, non-normalizing, and non-mutating. Startup validation protects author mistakes; runtime guards protect engine invariants. Do not remove a runtime guard merely because startup validation overlaps it.

When extending a schema, preserve useful error context: code, topic/level/item location, message, expected value, and received value where applicable.

## Development Rules

Runtime code shares screen state, `screenGeneration`, Back targets, question queues, timers, focus callbacks, audio callbacks, scores, and active topic/level state. Treat broad changes as regression-sensitive.

Back navigation must cancel active work. Going Back from a game must not increment a wrong answer, leave timers or feedback callbacks running, or allow a stale callback to restore an earlier screen. `screenGeneration` guards scheduled callbacks against stale screens.

Queue changes must preserve educational behavior and source immutability. `buildRoundFromPool()` and `buildBalancedRound()` construct queues without mutating public source records; Vieta also has specialized group behavior.

Avoid adding external dependencies or binary audio, image, or font assets without a strong project-level reason and documented licensing. Current sound effects use Web Audio synthesis.

## Testing

At minimum, run:

```bash
node --check content.js
node --check game.js
```

The production configuration must return zero validation errors. Exercise all `6 × 3 = 18` topic/level routes after changes.

Test a modern desktop browser and a mobile-width layout where possible. Automated checks help, but they do not replace a browser smoke test.

Critical regression areas:

- Back navigation and cancellation
- Timers and question resolution
- Signed input in Proportions Level 3, Exponents Levels 2 and 3, and Vieta Level 2
- `CONFIG ERROR` bootstrap behavior
- Result screens and score tracking
- Source immutability

Current timing policy: the default question time is 7 seconds; Square Identities Level 3 uses 9 seconds; Vieta Levels 1 and 2 use 10 seconds; Vieta Level 3 uses 15 seconds.

## Changing a Content Contract

An incompatible schema change must update the production examples and data, startup validator, runtime adapter, [CUSTOMIZE.md](CUSTOMIZE.md), and regression coverage together.

## Adding New Mechanics

Before adding a renderer, task kind, input mode, timer rule, or queue policy, identify its effect on validation, preview flow, answer checking, Back cancellation, focus, audio, result handling, and mobile layout. Keep new behavior narrowly scoped and test all existing routes.

## Pull Requests

Keep pull requests focused. Describe what changed, state whether the public content contract changed, list validation and tests run, and include screenshots for visible UI changes when useful.
