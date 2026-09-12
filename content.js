const PROJECT_CONFIG = {
  browserTitle: "D_MATH BOOSTER",

  splashLines: [
    "D_MATH",
    "BOOSTER"
  ]
};

const GAME_CONTENT = {
  branches: [
    {
      key: "algebra",
      title: "Algebra",
      topics: [
        {
          key: "proportions",
          title: "1. Proportions",
          intro: {
            lines: ["1. Proportions"]
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "Easy",
              source: {
                kind: "pool",
                items: [
                  { a: 1, b: 2, c: 4, d: 8 },
                  { a: 2, b: 3, c: 8, d: 12 },
                  { a: 3, b: 4, c: 9, d: 12 },
                  { a: 4, b: 5, c: 8, d: 10 },
                  { a: 5, b: 6, c: 10, d: 12 },
                  { a: 6, b: 7, c: 12, d: 14 },
                  { a: 7, b: 8, c: 14, d: 16 },
                  { a: 3, b: 5, c: 9, d: 15 }
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Normal",
              source: {
                kind: "pool",
                items: [
                  { a: 2, b: 5, c: 6, d: 15 },
                  { a: 3, b: 7, c: 9, d: 21 },
                  { a: 4, b: 9, c: 12, d: 27 },
                  { a: 5, b: 8, c: 15, d: 24 }
                ]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Hard",
              source: {
                kind: "pool",
                items: [
                  { a: -1, b: 2, c: -4, d: 8 },
                  { a: 2, b: -3, c: 8, d: -12 },
                  { a: -3, b: 4, c: -9, d: 12 },
                  { a: 4, b: -5, c: 8, d: -10 },
                  { a: -5, b: 6, c: -10, d: 12 },
                  { a: 6, b: -7, c: 12, d: -14 },
                  { a: -7, b: 8, c: -14, d: 16 },
                  { a: 3, b: -5, c: 9, d: -15 }
                ]
              }
            }
          ]
        },
        {
          key: "exponents",
          title: "2. Exponents",
          intro: {
            lines: ["2. Exponents"]
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "Easy",
              source: {
                kind: "pool",
                items: [
                  { kind: "resultRight", expression: "2 × 10² × 10⁻¹", answer: 20 },
                  { kind: "resultRight", expression: "3 × 10³ × 10⁻²", answer: 30 },
                  { kind: "resultRight", expression: "4 × 10³ ÷ 10²", answer: 40 },
                  { kind: "resultRight", expression: "5 × 10⁴ ÷ 10³", answer: 50 },
                  { kind: "resultRight", expression: "2 × 10⁴ × 10⁻²", answer: 200 },
                  { kind: "resultRight", expression: "3 × 10⁴ ÷ 10²", answer: 300 },
                  { kind: "resultRight", expression: "4 × 10⁵ × 10⁻³", answer: 400 },
                  { kind: "resultRight", expression: "5 × 10⁵ ÷ 10³", answer: 500 }
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Normal",
              source: {
                kind: "pool",
                items: [
                  { kind: "reducedExponent", left: "10³ × 10⁻²", answer: 1 },
                  { kind: "reducedExponent", left: "10⁴ × 10⁻²", answer: 2 },
                  { kind: "reducedExponent", left: "10⁵ ÷ 10²", answer: 3 },
                  { kind: "reducedExponent", left: "10² × 10⁻²", answer: 0 },
                  { kind: "reducedExponent", left: "10² × 10⁻³", answer: -1 },
                  { kind: "reducedExponent", left: "10¹ × 10⁻³", answer: -2 },
                  { kind: "reducedExponent", left: "10⁻¹ × 10³", answer: 2 },
                  { kind: "reducedExponent", left: "10⁻² × 10⁵", answer: 3 }
                ]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Hard",
              source: {
                kind: "pool",
                items: [
                  {
                    kind: "mixedInput",
                    beforeInput: "2 × 10",
                    afterInput: " × 10⁻² = 20",
                    answer: 3
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "3 × 10",
                    afterInput: " ÷ 10² = 300",
                    answer: 4
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "",
                    afterInput: " × 10³ × 10⁻² = 40",
                    answer: 4
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "",
                    afterInput: " × 10⁴ ÷ 10² = 500",
                    answer: 5
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "4 × 10",
                    afterInput: " × 10³ = 400",
                    answer: -1
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "5 × 10",
                    afterInput: " × 10⁴ = 500",
                    answer: -2
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "10³ × 10",
                    afterInput: " = 10¹",
                    answer: -2
                  },
                  {
                    kind: "mixedInput",
                    beforeInput: "10⁻¹ × 10",
                    afterInput: " = 10²",
                    answer: 3
                  }
                ]
              }
            }
          ]
        },
        {
          key: "squareIdentities",
          title: "3. Square Identities",
          intro: {
            lines: ["3. Square", "Identities"],
            className: "square-identities-intro-title"
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "Easy",
              source: {
                kind: "pool",
                items: [
                  { expression: "x² + 6x + 9", answerKind: "squareSum", leadingSquare: 1 },
                  { expression: "x² − 8x + 16", answerKind: "squareDifference", leadingSquare: 1 },
                  { expression: "x² − 25", answerKind: "differenceSquares", leadingSquare: 1 },
                  { expression: "x² + 10x + 25", answerKind: "squareSum", leadingSquare: 1 },
                  { expression: "x² − 4x + 4", answerKind: "squareDifference", leadingSquare: 1 },
                  { expression: "x² − 49", answerKind: "differenceSquares", leadingSquare: 1 },
                  { expression: "x² + 12x + 36", answerKind: "squareSum", leadingSquare: 1 },
                  { expression: "x² − 14x + 49", answerKind: "squareDifference", leadingSquare: 1 },
                  { expression: "x² − 64", answerKind: "differenceSquares", leadingSquare: 1 },
                  { expression: "x² + 16x + 64", answerKind: "squareSum", leadingSquare: 1 },
                  { expression: "x² − 18x + 81", answerKind: "squareDifference", leadingSquare: 1 },
                  { expression: "x² − 81", answerKind: "differenceSquares", leadingSquare: 1 }
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Normal",
              source: {
                kind: "pool",
                items: [
                  { expression: "4x² + 4x + 1", answerKind: "squareSum", leadingSquare: 4 },
                  { expression: "4x² − 8x + 4", answerKind: "squareDifference", leadingSquare: 4 },
                  { expression: "4x² − 9", answerKind: "differenceSquares", leadingSquare: 4 },
                  { expression: "9x² + 6x + 1", answerKind: "squareSum", leadingSquare: 9 },
                  { expression: "9x² − 12x + 4", answerKind: "squareDifference", leadingSquare: 9 },
                  { expression: "9x² − 16", answerKind: "differenceSquares", leadingSquare: 9 },
                  { expression: "4x² + 12x + 9", answerKind: "squareSum", leadingSquare: 4 },
                  { expression: "4x² − 12x + 9", answerKind: "squareDifference", leadingSquare: 4 },
                  { expression: "9x² − 25", answerKind: "differenceSquares", leadingSquare: 9 },
                  { expression: "16x² + 8x + 1", answerKind: "squareSum", leadingSquare: 16 },
                  { expression: "16x² − 16x + 4", answerKind: "squareDifference", leadingSquare: 16 },
                  { expression: "16x² − 9", answerKind: "differenceSquares", leadingSquare: 16 },
                  { expression: "16x² + 24x + 9", answerKind: "squareSum", leadingSquare: 16 },
                  { expression: "16x² − 24x + 9", answerKind: "squareDifference", leadingSquare: 16 },
                  { expression: "16x² − 25", answerKind: "differenceSquares", leadingSquare: 16 }
                ]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Hard",
              source: {
                kind: "pool",
                items: [
                  {
                    expression: "x² + 6x + 9",
                    choices: ["(x + 3)²", "(x − 3)²", "(x − 3)(x + 3)"],
                    correctIndex: 0,
                    leadingSquare: 1
                  },
                  {
                    expression: "x² − 8x + 16",
                    choices: ["(x + 4)²", "(x − 4)²", "(x − 4)(x + 4)"],
                    correctIndex: 1,
                    leadingSquare: 1
                  },
                  {
                    expression: "x² − 25",
                    choices: ["(x − 5)²", "(x + 5)²", "(x − 5)(x + 5)"],
                    correctIndex: 2,
                    leadingSquare: 1
                  },
                  {
                    expression: "4x² + 4x + 1",
                    choices: ["(2x + 1)²", "(2x − 1)²", "(2x − 1)(2x + 1)"],
                    correctIndex: 0,
                    leadingSquare: 4
                  },
                  {
                    expression: "4x² − 8x + 4",
                    choices: ["(2x + 2)²", "(2x − 2)²", "(2x − 2)(2x + 2)"],
                    correctIndex: 1,
                    leadingSquare: 4
                  },
                  {
                    expression: "4x² − 9",
                    choices: ["(2x − 3)²", "(2x + 3)²", "(2x − 3)(2x + 3)"],
                    correctIndex: 2,
                    leadingSquare: 4
                  },
                  {
                    expression: "9x² + 6x + 1",
                    choices: ["(3x + 1)²", "(3x − 1)²", "(3x − 1)(3x + 1)"],
                    correctIndex: 0,
                    leadingSquare: 9
                  },
                  {
                    expression: "9x² − 12x + 4",
                    choices: ["(3x + 2)²", "(3x − 2)²", "(3x − 2)(3x + 2)"],
                    correctIndex: 1,
                    leadingSquare: 9
                  },
                  {
                    expression: "9x² − 16",
                    choices: ["(3x − 4)²", "(3x + 4)²", "(3x − 4)(3x + 4)"],
                    correctIndex: 2,
                    leadingSquare: 9
                  },
                  {
                    expression: "4x² + 12x + 9",
                    choices: ["(2x + 3)²", "(2x − 3)²", "(2x − 3)(2x + 3)"],
                    correctIndex: 0,
                    leadingSquare: 4
                  },
                  {
                    expression: "4x² − 12x + 9",
                    choices: ["(2x + 3)²", "(2x − 3)²", "(2x − 3)(2x + 3)"],
                    correctIndex: 1,
                    leadingSquare: 4
                  },
                  {
                    expression: "16x² + 8x + 1",
                    choices: ["(4x + 1)²", "(4x − 1)²", "(4x − 1)(4x + 1)"],
                    correctIndex: 0,
                    leadingSquare: 16
                  },
                  {
                    expression: "16x² − 16x + 4",
                    choices: ["(4x + 2)²", "(4x − 2)²", "(4x − 2)(4x + 2)"],
                    correctIndex: 1,
                    leadingSquare: 16
                  },
                  {
                    expression: "16x² − 9",
                    choices: ["(4x − 3)²", "(4x + 3)²", "(4x − 3)(4x + 3)"],
                    correctIndex: 2,
                    leadingSquare: 16
                  },
                  {
                    expression: "16x² + 24x + 9",
                    choices: ["(4x + 3)²", "(4x − 3)²", "(4x − 3)(4x + 3)"],
                    correctIndex: 0,
                    leadingSquare: 16
                  },
                  {
                    expression: "16x² − 24x + 9",
                    choices: ["(4x + 3)²", "(4x − 3)²", "(4x − 3)(4x + 3)"],
                    correctIndex: 1,
                    leadingSquare: 16
                  },
                  {
                    expression: "16x² − 25",
                    choices: ["(4x − 5)²", "(4x + 5)²", "(4x − 5)(4x + 5)"],
                    correctIndex: 2,
                    leadingSquare: 16
                  }
                ]
              }
            }
          ]
        },
        {
          key: "squaresRoots",
          title: "4. Squares / Roots",
          intro: {
            lines: ["4. Squares / Roots"],
            className: "squares-roots-intro-title"
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "Multiplication",
              source: {
                kind: "pool",
                items: [
                  [6, 7],
                  [6, 8],
                  [6, 9],
                  [7, 6],
                  [7, 8],
                  [7, 9],
                  [8, 6],
                  [8, 7],
                  [8, 9],
                  [9, 6],
                  [9, 7],
                  [9, 8]
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Squares",
              source: {
                kind: "pool",
                items: [7, 8, 9, 10, 11, 12, 13, 14, 15]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Roots",
              source: {
                kind: "pool",
                items: [7, 8, 9, 10, 11, 12, 13, 14, 15]
              }
            }
          ]
        },
        {
          key: "vieta",
          title: "5. Vieta’s Formulas",
          titleLines: ["5. Vieta’s", "Formulas"],
          intro: {
            lines: ["5. Vieta’s", "Formulas"],
            className: "vieta-intro-title blink"
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "One Positive Root",
              source: {
                kind: "pool",
                items: [
                  { roots: [1, 3] },
                  { roots: [1, 4] },
                  { roots: [1, 5] },
                  { roots: [1, 6] },
                  { roots: [1, 7] },
                  { roots: [2, 3] },
                  { roots: [2, 4] },
                  { roots: [2, 5] },
                  { roots: [2, 6] },
                  { roots: [2, 7] },
                  { roots: [3, 4] },
                  { roots: [3, 5] },
                  { roots: [3, 6] },
                  { roots: [3, 7] },
                  { roots: [4, 5] },
                  { roots: [4, 6] },
                  { roots: [4, 7] },
                  { roots: [5, 6] }
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Signed Roots",
              source: {
                kind: "pool",
                items: [
                  { roots: [1, -1] },
                  { roots: [2, -1] },
                  { roots: [1, -2] },
                  { roots: [3, -1] },
                  { roots: [1, -3] },
                  { roots: [3, -2] },
                  { roots: [2, -3] },
                  { roots: [4, -2] },
                  { roots: [5, -2] },
                  { roots: [4, -3] },
                  { roots: [5, -3] },
                  { roots: [6, -3] }
                ]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Find Both Roots",
              source: {
                kind: "pool",
                items: [
                  { roots: [1, 2] },
                  { roots: [1, 3] },
                  { roots: [1, 4] },
                  { roots: [1, 5] },
                  { roots: [1, 6] },
                  { roots: [1, 7] },
                  { roots: [2, 3] },
                  { roots: [2, 4] },
                  { roots: [2, 5] },
                  { roots: [2, 6] },
                  { roots: [2, 7] },
                  { roots: [3, 4] },
                  { roots: [3, 5] },
                  { roots: [3, 6] },
                  { roots: [3, 7] },
                  { roots: [4, 5] },
                  { roots: [4, 6] },
                  { roots: [4, 7] },
                  { roots: [5, 6] },
                  { roots: [2, 2] },
                  { roots: [3, 3] },
                  { roots: [4, 4] },
                  { roots: [5, 5] }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      key: "geometry",
      title: "Geometry",
      topics: [
        {
          key: "triangles",
          title: "1. Triangles",
          intro: {
            lines: ["1. Triangles"]
          },
          levels: [
            {
              key: "level1",
              title: "Level 1",
              label: "Easy",
              source: {
                kind: "pool",
                items: [
                  { a: 3, b: 4, c: 5 },
                  { a: 6, b: 8, c: 10 },
                  { a: 9, b: 12, c: 15 },
                  { a: 12, b: 16, c: 20 }
                ]
              }
            },
            {
              key: "level2",
              title: "Level 2",
              label: "Normal",
              source: {
                kind: "pool",
                items: [
                  { a: 5, b: 12, c: 13 },
                  { a: 8, b: 15, c: 17 },
                  { a: 7, b: 24, c: 25 },
                  { a: 10, b: 24, c: 26 }
                ]
              }
            },
            {
              key: "level3",
              title: "Level 3",
              label: "Hard",
              source: {
                kind: "pool",
                items: [
                  { a: 20, b: 21, c: 29 },
                  { a: 12, b: 35, c: 37 },
                  { a: 9, b: 40, c: 41 },
                  { a: 28, b: 45, c: 53 }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
