# Customizing D_MATH BOOSTER

For most content changes, you only need to edit `content.js`. This applies to the six included topics and their three supported levels.

## Before You Start

Keep `index.html`, `style.css`, `content.js`, and `game.js` together. Make one small change at a time, save `content.js`, reload the page, check for `CONFIG ERROR`, and play the changed level. Use Git or keep a copy before larger edits.

This guide covers the public content contract. See [CONTRIBUTING.md](CONTRIBUTING.md) before changing game mechanics.

## What You Can Edit Safely

In `content.js`, you can edit:

- `browserTitle` and the two `splashLines`
- Branch titles and branch order
- The order of existing supported topics
- Topic titles, `titleLines`, and `intro.lines`
- Existing level titles and labels
- Exercise pools for the included topics

### Conditional changes

Moving or removing an existing supported topic is possible, but treat it as an advanced change. Topic keys must remain unique, and every remaining branch must contain at least one topic. Pool order does not control the exact order of questions in a round.

### Changes that require `game.js`

Do not add a new topic key, `level4`, a task kind, renderer, input type, timer behavior, queue strategy, or signed-input behavior in `content.js` alone. Those changes require coordinated engine work.

## `PROJECT_CONFIG`

The current project configuration has two fields:

```js
const PROJECT_CONFIG = {
  browserTitle: "D_MATH BOOSTER",
  splashLines: ["D_MATH", "BOOSTER"]
};
```

`browserTitle` sets the browser tab title. `splashLines` contains exactly two non-empty strings for the opening display.

## Branches and Topics

`GAME_CONTENT.branches` contains branch objects. Each branch needs a unique non-empty `key`, a non-empty `title`, and a non-empty `topics` array.

```js
{
  key: "geometry",
  title: "Geometry",
  topics: [/* supported topic objects */]
}
```

Supported topic keys are:

```txt
triangles
proportions
exponents
squareIdentities
squaresRoots
vieta
```

Do not invent a new key unless you also update `game.js`.

`topic.title`, `topic.titleLines`, and `topic.intro.lines` are separate presentation fields. Changing `topic.title` does not rewrite the other fields. Edit each one explicitly when you want matching text. `titleLines` and `intro` are optional metadata; `intro.className` must be a string when it is present.

Every included topic needs `level1`, `level2`, and `level3`. Level titles and labels are single-source metadata in `GAME_CONTENT`, so changing them updates Level Select, previews, game headers, results, and the Vieta special flow. Do not add `level4`: the current engine will report `CONFIG ERROR`.

## Exercise Pools

Every level uses this envelope:

```js
source: {
  kind: "pool",
  items: [/* exercises */]
}
```

`kind` must be `"pool"`, and `items` must not be empty. Exercise objects use strict fields: do not add convenience fields unless their schema explicitly allows them. For example, this is invalid for Vieta Level 1 because `answer` is derived by the engine:

```js
{ roots: [2, 4], answer: 4 }
```

### Triangles

Use a valid Pythagorean triple:

```js
{ a: 3, b: 4, c: 5 }
```

`a`, `b`, and `c` must be positive integers, `c` is the hypotenuse, and `a² + b² === c²`. The engine chooses which side to hide.

### Proportions

Use four integers representing `a / b = c / d`:

```js
{ a: 1, b: 2, c: 4, d: 8 }
```

`b` and `d` must not be zero, and `a * d === b * c`. Levels 1 and 2 require positive values because their answer input is unsigned. Level 3 accepts signed integer values.

### Exponents

Exponents has three level-specific task kinds. Do not invent a new `kind`.

**Level 1** uses `resultRight`:

```js
{ kind: "resultRight", expression: "2 × 10² × 10⁻¹", answer: 20 }
```

`expression` is a non-empty string and `answer` is a non-negative integer.

**Level 2** uses `reducedExponent`:

```js
{ kind: "reducedExponent", left: "10² × 10⁻³", answer: -1 }
```

`left` is a non-empty string and `answer` is an integer.

**Level 3** uses `mixedInput`:

```js
{
  kind: "mixedInput",
  beforeInput: "4 × 10",
  afterInput: " × 10³ = 400",
  answer: -1
}
```

`beforeInput` and `afterInput` are strings and may be empty. Do not invent new mixed-input layouts unless `game.js` is updated to support them.

### Square Identities

Levels 1 and 2 use an expression and a category answer:

```js
{
  expression: "x² − 25",
  answerKind: "differenceSquares",
  leadingSquare: 1
}
```

`leadingSquare` is optional, but when present it must be a positive integer. The supported `answerKind` values are:

- `differenceSquares` for `a² − b²`
- `squareDifference` for `(a − b)²`
- `squareSum` for `(a + b)²`

Each Level 1 and Level 2 pool must include at least one task for all three answer kinds.

Level 2 uses the same schema, for example:

```js
{
  expression: "4x² − 9",
  answerKind: "differenceSquares",
  leadingSquare: 4
}
```

Level 3 uses exactly three choices:

```js
{
  expression: "x² − 25",
  choices: ["(x − 5)²", "(x + 5)²", "(x − 5)(x + 5)"],
  correctIndex: 2,
  leadingSquare: 1
}
```

`correctIndex` must be `0`, `1`, or `2`. The complete Level 3 pool must contain at least one item for each index so correct-button placement varies.

### Squares / Roots

Level 1 uses two different positive integers:

```js
[6, 7]
```

The engine asks for their product. A mirrored pair is not required.

Level 2 uses one positive integer for square practice:

```js
12
```

Level 3 also uses one positive integer:

```js
13
```

The engine turns the Level 3 value into a square-root question.

### Vieta’s Formulas

Vieta source items are intentionally small. Edit only the root pair:

```js
{ roots: [2, 4] }
```

The engine derives `p`, `q`, the equation, the answer, known-root direction, and pair classification.

**Level 1** requires two distinct positive integer roots, each at most `7`, with a product at most `30`:

```js
{ roots: [2, 4] }
```

**Level 2** requires two non-zero integer roots with opposite signs, each magnitude at most `7`, and product magnitude at most `30`:

```js
{ roots: [3, -2] }
```

One Level 2 pair automatically produces both known-root directions. Do not add mirrored duplicates for that purpose.

**Level 3** requires positive integer roots, each at most `7`, with a product at most `30`. Equal roots are allowed:

```js
{ roots: [2, 2] }
```

An unequal pair produces an ordinary task; an equal pair produces a double-root task. A valid Level 3 pool must include at least one of each, for example `{ roots: [1, 2] }` and `{ roots: [2, 2] }`.

## Small Pools and Repeated Exercises

Rounds contain 12 questions; that is engine policy, not a `content.js` setting. A pool may contain fewer than 12 source items, so the game can reuse items when needed.

Square Identities pools must still satisfy their required answer-kind or `correctIndex` groups. Vieta Level 3 must still contain ordinary and double-root pairs.

Duplicate valid source items are allowed and may be intentional, but queue rules can affect how repetition appears in a round. Do not rely on source order as the exact order of questions.

## `CONFIG ERROR`

On page load, D_MATH BOOSTER validates supported configuration data. Invalid data shows a `CONFIG ERROR` with contextual details such as topic, level, item, message, expected value, and received value when applicable.

For example:

```txt
Vieta’s Formulas
Level 2 · Item 3

roots must have opposite signs.
```

## JavaScript Syntax Errors

The validator runs only after `content.js` loads successfully as JavaScript. A missing comma, quote, `]`, or `}` can prevent it from loading. If that happens, open the browser developer console and inspect the syntax error near the reported line.

## Advanced Customization

Use a coding assistant if helpful, but keep documented schemas unchanged and test each edited level. For changes to mechanics, validation, rendering, timers, or input behavior, read [CONTRIBUTING.md](CONTRIBUTING.md) first.

For a project overview and local quick start, see [README.md](README.md).
