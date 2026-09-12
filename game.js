const INITIAL_PROJECT_CONFIG =
  typeof PROJECT_CONFIG === "undefined" ? null : PROJECT_CONFIG;
const INITIAL_GAME_CONTENT =
  typeof GAME_CONTENT === "undefined" ? null : GAME_CONTENT;

const INTRO_MATH_DURATION_MS = 3000;
const INTRO_SECTION_DURATION_MS = 3000;
const QUESTION_DURATION_MS = 7000;
const FEEDBACK_DURATION_MS = 450;
const TIMER_UPDATE_MS = 50;
const QUESTIONS_PER_ROUND = 12;
const LEVEL_PREVIEW_DURATION_MS = 5000;
const PROPORTION_PREVIEW_DURATION_MS = 5000;
const EXPONENT_PREVIEW_DURATION_MS = 5000;
const SQUARE_IDENTITIES_PREVIEW_DURATION_MS = 5000;
const SQUARES_ROOTS_PREVIEW_DURATION_MS = 5000;
const VIETA_PREVIEW_DURATION_MS = 5000;

const SOUND_ENABLED = true;

const TIMER_BEEP_FREQUENCY = 880;
const TIMER_BEEP_DURATION_MS = 70;
const TIMER_BEEP_VOLUME = 0.08;

const NEXT_BEEP_FREQUENCY = 1320;
const NEXT_BEEP_DURATION_MS = 90;
const NEXT_BEEP_VOLUME = 0.1;

const NEXT_BEEP_COUNT = 6;
const NEXT_BEEP_GAP_MS = 70;
const APP_TITLE = getSplashLine(INITIAL_PROJECT_CONFIG, 0, "D_MATH");
const APP_SUBTITLE = getSplashLine(INITIAL_PROJECT_CONFIG, 1, "BOOSTER");

const ERROR_QUACK_VOLUME = 0.18;
const ERROR_QUACK_DURATION_MS = 260;
const ERROR_QUACK_START_FREQUENCY = 260;
const ERROR_QUACK_END_FREQUENCY = 70;

const WIN_FANFARE_VOLUME = 0.12;
const WIN_FANFARE_NOTE_MS = 140;
const WIN_FANFARE_GAP_MS = 40;
const WIN_FANFARE_NOTES = [523, 659, 784, 1046, 784, 1046];

const SQUARE_IDENTITY_LEVELS = {
  level1: {
    mode: "category"
  },

  level2: {
    mode: "category"
  },

  level3: {
    mode: "exactChoice"
  }
};

const SQUARE_IDENTITY_ANSWER_KINDS = [
  "differenceSquares",
  "squareDifference",
  "squareSum"
];

const SQUARES_ROOTS_LEVELS = {
  level1: {
    mode: "multiplication",
    preview: "7 × 8 = 56"
  },

  level2: {
    mode: "square",
    preview: "12² = 144"
  },

  level3: {
    mode: "root",
    preview: "√169 = 13"
  }
};

const SUPPORTED_TOPIC_KEYS = [
  "triangles",
  "proportions",
  "exponents",
  "squareIdentities",
  "squaresRoots",
  "vieta"
];
const SUPPORTED_LEVEL_KEYS = ["level1", "level2", "level3"];
const CONFIG_ERROR_SCREEN_LIMIT = 5;

function getSplashLine(projectConfig, index, fallback) {
  if (
    projectConfig &&
    Array.isArray(projectConfig.splashLines) &&
    typeof projectConfig.splashLines[index] === "string" &&
    projectConfig.splashLines[index].trim()
  ) {
    return projectConfig.splashLines[index];
  }

  return fallback;
}

function validateGameConfig(projectConfig, gameContent) {
  const errors = [];

  validateProjectConfig(projectConfig, errors);
  validateGameContent(gameContent, errors);

  return {
    ok: errors.length === 0,
    errors
  };
}

function validateProjectConfig(projectConfig, errors) {
  if (!isPlainObject(projectConfig)) {
    addConfigError(errors, {
      code: "PROJECT_CONFIG_MISSING",
      message: "PROJECT_CONFIG must be an object.",
      expected: '{ browserTitle: "...", splashLines: ["...", "..."] }',
      received: projectConfig
    });
    return;
  }

  if (!isNonEmptyString(projectConfig.browserTitle)) {
    addConfigError(errors, {
      code: "PROJECT_CONFIG_BROWSER_TITLE",
      field: "browserTitle",
      message: "browserTitle must be a non-empty string.",
      expected: 'browserTitle: "D_MATH BOOSTER"',
      received: projectConfig.browserTitle
    });
  }

  if (
    !Array.isArray(projectConfig.splashLines) ||
    projectConfig.splashLines.length !== 2 ||
    !projectConfig.splashLines.every(isNonEmptyString)
  ) {
    addConfigError(errors, {
      code: "PROJECT_CONFIG_SPLASH_LINES",
      field: "splashLines",
      message: "splashLines must contain exactly two non-empty strings.",
      expected: 'splashLines: ["D_MATH", "BOOSTER"]',
      received: projectConfig.splashLines
    });
  }
}

function validateGameContent(gameContent, errors) {
  if (!isPlainObject(gameContent)) {
    addConfigError(errors, {
      code: "GAME_CONTENT_MISSING",
      message: "GAME_CONTENT must be an object.",
      expected: '{ branches: [...] }',
      received: gameContent
    });
    return;
  }

  if (!Array.isArray(gameContent.branches) || gameContent.branches.length === 0) {
    addConfigError(errors, {
      code: "GAME_CONTENT_BRANCHES",
      field: "branches",
      message: "branches must be a non-empty array.",
      expected: 'branches: [{ key: "...", title: "...", topics: [...] }]',
      received: gameContent.branches
    });
    return;
  }

  const branchKeys = new Set();
  const topicKeys = new Set();

  gameContent.branches.forEach(function (branch, branchIndex) {
    validateBranchConfig(branch, branchIndex, branchKeys, topicKeys, errors);
  });
}

function validateBranchConfig(branch, branchIndex, branchKeys, topicKeys, errors) {
  if (!isPlainObject(branch)) {
    addConfigError(errors, {
      code: "BRANCH_INVALID",
      field: `branches[${branchIndex}]`,
      message: "Each branch must be an object.",
      expected: '{ key: "...", title: "...", topics: [...] }',
      received: branch
    });
    return;
  }

  const branchKey = isNonEmptyString(branch.key) ? branch.key : undefined;

  if (!branchKey) {
    addConfigError(errors, {
      code: "BRANCH_KEY",
      field: "key",
      message: "Branch key must be a non-empty string.",
      expected: 'key: "algebra"',
      received: branch.key
    });
  } else if (branchKeys.has(branchKey)) {
    addConfigError(errors, {
      code: "BRANCH_KEY_DUPLICATE",
      branchKey,
      field: "key",
      message: "Branch keys must be unique.",
      expected: "A unique branch key.",
      received: branchKey
    });
  } else {
    branchKeys.add(branchKey);
  }

  if (!isNonEmptyString(branch.title)) {
    addConfigError(errors, {
      code: "BRANCH_TITLE",
      branchKey,
      field: "title",
      message: "Branch title must be a non-empty string.",
      expected: 'title: "Algebra"',
      received: branch.title
    });
  }

  if (!Array.isArray(branch.topics) || branch.topics.length === 0) {
    addConfigError(errors, {
      code: "BRANCH_TOPICS",
      branchKey,
      field: "topics",
      message: "Branch topics must be a non-empty array.",
      expected: "topics: [{ key: \"...\", levels: [...] }]",
      received: branch.topics
    });
    return;
  }

  branch.topics.forEach(function (topic, topicIndex) {
    validateTopicConfig(topic, topicIndex, branchKey, topicKeys, errors);
  });
}

function validateTopicConfig(topic, topicIndex, branchKey, topicKeys, errors) {
  if (!isPlainObject(topic)) {
    addConfigError(errors, {
      code: "TOPIC_INVALID",
      branchKey,
      field: `topics[${topicIndex}]`,
      message: "Each topic must be an object.",
      expected: '{ key: "...", title: "...", levels: [...] }',
      received: topic
    });
    return;
  }

  const topicKey = isNonEmptyString(topic.key) ? topic.key : undefined;

  if (!topicKey) {
    addConfigError(errors, {
      code: "TOPIC_KEY",
      branchKey,
      field: "key",
      message: "Topic key must be a non-empty string.",
      expected: 'key: "triangles"',
      received: topic.key
    });
  } else {
    if (topicKeys.has(topicKey)) {
      addConfigError(errors, {
        code: "TOPIC_KEY_DUPLICATE",
        branchKey,
        topicKey,
        field: "key",
        message: "Topic keys must be unique across all branches.",
        expected: "A unique topic key.",
        received: topicKey
      });
    } else {
      topicKeys.add(topicKey);
    }

    if (!SUPPORTED_TOPIC_KEYS.includes(topicKey)) {
      addConfigError(errors, {
        code: "TOPIC_UNSUPPORTED",
        branchKey,
        topicKey,
        field: "key",
        message: "This topic is not supported by the current game engine.",
        expected: `One of: ${SUPPORTED_TOPIC_KEYS.join(", ")}.`,
        received: topicKey
      });
    }
  }

  if (!isNonEmptyString(topic.title)) {
    addConfigError(errors, {
      code: "TOPIC_TITLE",
      branchKey,
      topicKey,
      field: "title",
      message: "Topic title must be a non-empty string.",
      expected: 'title: "1. Triangles"',
      received: topic.title
    });
  }

  validateTopicDisplayMetadata(topic, branchKey, topicKey, errors);
  validateTopicLevels(topic, branchKey, topicKey, errors);
}

function validateTopicDisplayMetadata(topic, branchKey, topicKey, errors) {
  if (Object.prototype.hasOwnProperty.call(topic, "titleLines")) {
    if (
      !Array.isArray(topic.titleLines) ||
      topic.titleLines.length === 0 ||
      !topic.titleLines.every(isNonEmptyString)
    ) {
      addConfigError(errors, {
        code: "TOPIC_TITLE_LINES",
        branchKey,
        topicKey,
        field: "titleLines",
        message: "titleLines must be a non-empty array of non-empty strings.",
        expected: 'titleLines: ["5. Vieta’s", "Formulas"]',
        received: topic.titleLines
      });
    }
  }

  if (!Object.prototype.hasOwnProperty.call(topic, "intro")) {
    return;
  }

  if (!isPlainObject(topic.intro)) {
    addConfigError(errors, {
      code: "TOPIC_INTRO",
      branchKey,
      topicKey,
      field: "intro",
      message: "intro must be an object when provided.",
      expected: '{ lines: ["..."] }',
      received: topic.intro
    });
    return;
  }

  if (Object.prototype.hasOwnProperty.call(topic.intro, "lines")) {
    if (
      !Array.isArray(topic.intro.lines) ||
      topic.intro.lines.length === 0 ||
      !topic.intro.lines.every(isNonEmptyString)
    ) {
      addConfigError(errors, {
        code: "TOPIC_INTRO_LINES",
        branchKey,
        topicKey,
        field: "intro.lines",
        message: "intro.lines must be a non-empty array of non-empty strings.",
        expected: 'lines: ["1. Triangles"]',
        received: topic.intro.lines
      });
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(topic.intro, "className") &&
    typeof topic.intro.className !== "string"
  ) {
    addConfigError(errors, {
      code: "TOPIC_INTRO_CLASS_NAME",
      branchKey,
      topicKey,
      field: "intro.className",
      message: "intro.className must be a string when provided.",
      expected: 'className: "vieta-intro-title blink"',
      received: topic.intro.className
    });
  }
}

function validateTopicLevels(topic, branchKey, topicKey, errors) {
  if (!Array.isArray(topic.levels) || topic.levels.length === 0) {
    addConfigError(errors, {
      code: "TOPIC_LEVELS",
      branchKey,
      topicKey,
      field: "levels",
      message: "Topic levels must be a non-empty array.",
      expected: "levels: [{ key: \"level1\", source: {...} }]",
      received: topic.levels
    });
    return;
  }

  const levelKeys = new Set();

  topic.levels.forEach(function (level, levelIndex) {
    validateLevelConfig(level, levelIndex, branchKey, topicKey, levelKeys, errors);
  });

  SUPPORTED_LEVEL_KEYS.forEach(function (levelKey) {
    if (!levelKeys.has(levelKey)) {
      addConfigError(errors, {
        code: "LEVEL_REQUIRED",
        branchKey,
        topicKey,
        levelKey,
        field: "levels",
        message: `${levelKey} is required by the current game engine.`,
        expected: "level1, level2, and level3.",
        received: Array.from(levelKeys)
      });
    }
  });
}

function validateLevelConfig(level, levelIndex, branchKey, topicKey, levelKeys, errors) {
  if (!isPlainObject(level)) {
    addConfigError(errors, {
      code: "LEVEL_INVALID",
      branchKey,
      topicKey,
      field: `levels[${levelIndex}]`,
      message: "Each level must be an object.",
      expected: '{ key: "level1", title: "...", label: "...", source: {...} }',
      received: level
    });
    return;
  }

  const levelKey = isNonEmptyString(level.key) ? level.key : undefined;

  if (!levelKey) {
    addConfigError(errors, {
      code: "LEVEL_KEY",
      branchKey,
      topicKey,
      field: "key",
      message: "Level key must be a non-empty string.",
      expected: 'key: "level1"',
      received: level.key
    });
  } else {
    if (levelKeys.has(levelKey)) {
      addConfigError(errors, {
        code: "LEVEL_KEY_DUPLICATE",
        branchKey,
        topicKey,
        levelKey,
        field: "key",
        message: "Level keys must be unique within a topic.",
        expected: "A unique level key.",
        received: levelKey
      });
    } else {
      levelKeys.add(levelKey);
    }

    if (!SUPPORTED_LEVEL_KEYS.includes(levelKey)) {
      addConfigError(errors, {
        code: "LEVEL_UNSUPPORTED",
        branchKey,
        topicKey,
        levelKey,
        field: "key",
        message: `Level ${levelKey.replace("level", "")} is not supported by the current game engine.`,
        expected: "Supported levels: level1, level2, level3.",
        received: levelKey
      });
    }
  }

  if (!isNonEmptyString(level.title)) {
    addConfigError(errors, {
      code: "LEVEL_TITLE",
      branchKey,
      topicKey,
      levelKey,
      field: "title",
      message: "Level title must be a non-empty string.",
      expected: 'title: "Level 1"',
      received: level.title
    });
  }

  if (!isNonEmptyString(level.label)) {
    addConfigError(errors, {
      code: "LEVEL_LABEL",
      branchKey,
      topicKey,
      levelKey,
      field: "label",
      message: "Level label must be a non-empty string.",
      expected: 'label: "Easy"',
      received: level.label
    });
  }

  const items = validateSourceEnvelope(level.source, branchKey, topicKey, levelKey, errors);

  if (
    items &&
    SUPPORTED_TOPIC_KEYS.includes(topicKey) &&
    SUPPORTED_LEVEL_KEYS.includes(levelKey)
  ) {
    validateTopicSource(topicKey, levelKey, items, branchKey, errors);
  }
}

function validateSourceEnvelope(source, branchKey, topicKey, levelKey, errors) {
  if (!isPlainObject(source)) {
    addConfigError(errors, {
      code: "SOURCE_MISSING",
      branchKey,
      topicKey,
      levelKey,
      field: "source",
      message: "Level source must be an object.",
      expected: '{ kind: "pool", items: [...] }',
      received: source
    });
    return null;
  }

  if (source.kind !== "pool") {
    addConfigError(errors, {
      code: "SOURCE_KIND",
      branchKey,
      topicKey,
      levelKey,
      field: "source.kind",
      message: "Only the pool source kind is supported.",
      expected: 'kind: "pool"',
      received: source.kind
    });
  }

  if (!Array.isArray(source.items)) {
    addConfigError(errors, {
      code: "SOURCE_ITEMS",
      branchKey,
      topicKey,
      levelKey,
      field: "source.items",
      message: "source.items must be an array.",
      expected: "items: [...]",
      received: source.items
    });
    return null;
  }

  if (source.items.length === 0) {
    addConfigError(errors, {
      code: "SOURCE_EMPTY",
      branchKey,
      topicKey,
      levelKey,
      field: "source.items",
      message: "source.items must contain at least one exercise.",
      expected: "At least one source item.",
      received: source.items
    });
    return null;
  }

  return source.kind === "pool" ? source.items : null;
}

function validateTopicSource(topicKey, levelKey, items, branchKey, errors) {
  if (topicKey === "triangles") {
    validateTriangleSource(items, branchKey, topicKey, levelKey, errors);
    return;
  }

  if (topicKey === "proportions") {
    validateProportionSource(items, branchKey, topicKey, levelKey, errors);
    return;
  }

  if (topicKey === "exponents") {
    validateExponentSource(items, branchKey, topicKey, levelKey, errors);
    return;
  }

  if (topicKey === "squareIdentities") {
    validateSquareIdentitySource(items, branchKey, topicKey, levelKey, errors);
    return;
  }

  if (topicKey === "squaresRoots") {
    validateSquaresRootsSource(items, branchKey, topicKey, levelKey, errors);
    return;
  }

  if (topicKey === "vieta") {
    validateVietaSource(items, branchKey, topicKey, levelKey, errors);
  }
}

function validateTriangleSource(items, branchKey, topicKey, levelKey, errors) {
  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (!validateExactItemFields(item, ["a", "b", "c"], context, errors)) {
      return;
    }

    if (![item.a, item.b, item.c].every(isPositiveInteger)) {
      addConfigError(errors, {
        ...context,
        code: "TRIANGLE_SIDES",
        message: "a, b, and c must be positive integers.",
        expected: "{ a: positive integer, b: positive integer, c: positive integer }",
        received: item
      });
      return;
    }

    if (item.a * item.a + item.b * item.b !== item.c * item.c) {
      addConfigError(errors, {
        ...context,
        code: "TRIANGLE_NOT_PYTHAGOREAN",
        message: "a² + b² must equal c² with c as the hypotenuse.",
        expected: "A right-triangle triple such as { a: 3, b: 4, c: 5 }.",
        received: item
      });
    }
  });
}

function validateProportionSource(items, branchKey, topicKey, levelKey, errors) {
  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (!validateExactItemFields(item, ["a", "b", "c", "d"], context, errors)) {
      return;
    }

    if (![item.a, item.b, item.c, item.d].every(Number.isInteger)) {
      addConfigError(errors, {
        ...context,
        code: "PROPORTION_INTEGERS",
        message: "a, b, c, and d must be integers.",
        expected: "{ a: integer, b: integer, c: integer, d: integer }",
        received: item
      });
      return;
    }

    if (item.b === 0 || item.d === 0) {
      addConfigError(errors, {
        ...context,
        code: "PROPORTION_ZERO_DENOMINATOR",
        message: "b and d must be non-zero denominators.",
        expected: "b !== 0 and d !== 0.",
        received: item
      });
      return;
    }

    if ((levelKey === "level1" || levelKey === "level2") &&
      ![item.a, item.b, item.c, item.d].every(isPositiveInteger)) {
      addConfigError(errors, {
        ...context,
        code: "PROPORTION_UNSIGNED_LEVEL",
        message: "Levels 1 and 2 require positive values because their answer input is unsigned.",
        expected: "Positive integer values for a, b, c, and d.",
        received: item
      });
      return;
    }

    if (item.a * item.d !== item.b * item.c) {
      addConfigError(errors, {
        ...context,
        code: "PROPORTION_CROSS_PRODUCT",
        message: "a * d must equal b * c.",
        expected: "A mathematically valid proportion.",
        received: item
      });
    }
  });
}

function validateExponentSource(items, branchKey, topicKey, levelKey, errors) {
  const contracts = {
    level1: {
      kind: "resultRight",
      fields: ["kind", "expression", "answer"]
    },
    level2: {
      kind: "reducedExponent",
      fields: ["kind", "left", "answer"]
    },
    level3: {
      kind: "mixedInput",
      fields: ["kind", "beforeInput", "afterInput", "answer"]
    }
  };
  const contract = contracts[levelKey];

  if (!contract) {
    return;
  }

  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (!validateExactItemFields(item, contract.fields, context, errors)) {
      return;
    }

    if (item.kind !== contract.kind) {
      addConfigError(errors, {
        ...context,
        code: "EXPONENT_KIND",
        message: `This level supports only the ${contract.kind} exponent task kind.`,
        expected: `kind: "${contract.kind}"`,
        received: item.kind
      });
    }

    const textFields = levelKey === "level1"
      ? ["expression"]
      : levelKey === "level2"
        ? ["left"]
        : ["beforeInput", "afterInput"];
    const invalidTextField = textFields.find(function (field) {
      return levelKey === "level3"
        ? typeof item[field] !== "string"
        : !isNonEmptyString(item[field]);
    });

    if (invalidTextField) {
      addConfigError(errors, {
        ...context,
        code: "EXPONENT_LAYOUT",
        field: invalidTextField,
        message: `${invalidTextField} must ${levelKey === "level3" ? "be a string" : "be a non-empty string"}.`,
        expected: `${invalidTextField}: "..."`,
        received: item[invalidTextField]
      });
    }

    if (!Number.isInteger(item.answer)) {
      addConfigError(errors, {
        ...context,
        code: "EXPONENT_ANSWER",
        field: "answer",
        message: "answer must be an integer.",
        expected: "answer: integer",
        received: item.answer
      });
    } else if (levelKey === "level1" && item.answer < 0) {
      addConfigError(errors, {
        ...context,
        code: "EXPONENT_L1_ANSWER",
        field: "answer",
        message: "Level 1 answer must be non-negative because its input is unsigned.",
        expected: "answer: non-negative integer",
        received: item.answer
      });
    }
  });
}

function validateSquareIdentitySource(items, branchKey, topicKey, levelKey, errors) {
  if (levelKey === "level1" || levelKey === "level2") {
    const foundKinds = new Set();

    items.forEach(function (item, index) {
      const context = createItemContext(branchKey, topicKey, levelKey, index);

      if (!validateOptionalLeadingSquareItem(item, ["expression", "answerKind"], context, errors)) {
        return;
      }

      if (!isNonEmptyString(item.expression)) {
        addConfigError(errors, {
          ...context,
          code: "SQUARE_IDENTITY_EXPRESSION",
          field: "expression",
          message: "expression must be a non-empty string.",
          expected: 'expression: "x² − 25"',
          received: item.expression
        });
      }

      if (!SQUARE_IDENTITY_ANSWER_KINDS.includes(item.answerKind)) {
        addConfigError(errors, {
          ...context,
          code: "SQUARE_IDENTITY_ANSWER_KIND",
          field: "answerKind",
          message: "answerKind must be supported by the current choice renderer.",
          expected: `One of: ${SQUARE_IDENTITY_ANSWER_KINDS.join(", ")}.`,
          received: item.answerKind
        });
      } else {
        foundKinds.add(item.answerKind);
      }
    });

    SQUARE_IDENTITY_ANSWER_KINDS.forEach(function (answerKind) {
      if (!foundKinds.has(answerKind)) {
        addConfigError(errors, {
          code: "SQUARE_IDENTITY_POOL_KIND",
          branchKey,
          topicKey,
          levelKey,
          field: "source.items",
          message: `This level must include at least one ${answerKind} task.`,
          expected: "All three Square Identities answer kinds.",
          received: Array.from(foundKinds)
        });
      }
    });
    return;
  }

  const foundIndexes = new Set();

  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (!validateOptionalLeadingSquareItem(item, ["expression", "choices", "correctIndex"], context, errors)) {
      return;
    }

    if (!isNonEmptyString(item.expression)) {
      addConfigError(errors, {
        ...context,
        code: "SQUARE_IDENTITY_EXPRESSION",
        field: "expression",
        message: "expression must be a non-empty string.",
        expected: 'expression: "x² − 25"',
        received: item.expression
      });
    }

    const choicesAreValid =
      Array.isArray(item.choices) &&
      item.choices.length === 3 &&
      item.choices.every(isNonEmptyString);

    if (!choicesAreValid) {
      addConfigError(errors, {
        ...context,
        code: "SQUARE_IDENTITY_CHOICES",
        field: "choices",
        message: "Level 3 choices must contain exactly three non-empty strings.",
        expected: 'choices: ["...", "...", "..."]',
        received: item.choices
      });
      return;
    }

    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= item.choices.length) {
      addConfigError(errors, {
        ...context,
        code: "SQUARE_IDENTITY_CORRECT_INDEX",
        field: "correctIndex",
        message: "correctIndex must point to one of the three choices.",
        expected: "correctIndex: 0, 1, or 2",
        received: item.correctIndex
      });
      return;
    }

    foundIndexes.add(item.correctIndex);
  });

  [0, 1, 2].forEach(function (correctIndex) {
    if (!foundIndexes.has(correctIndex)) {
      addConfigError(errors, {
        code: "SQUARE_IDENTITY_POOL_INDEX",
        branchKey,
        topicKey,
        levelKey,
        field: "source.items",
        message: `This level must include at least one task with correctIndex ${correctIndex}.`,
        expected: "Source representation for correctIndex 0, 1, and 2.",
        received: Array.from(foundIndexes)
      });
    }
  });
}

function validateOptionalLeadingSquareItem(item, requiredFields, context, errors) {
  const allowedFields = [...requiredFields, "leadingSquare"];

  if (!validateExactItemFields(item, allowedFields, context, errors, true)) {
    return false;
  }

  if (
    Object.prototype.hasOwnProperty.call(item, "leadingSquare") &&
    !isPositiveInteger(item.leadingSquare)
  ) {
    addConfigError(errors, {
      ...context,
      code: "SQUARE_IDENTITY_LEADING_SQUARE",
      field: "leadingSquare",
      message: "leadingSquare must be a positive integer when provided.",
      expected: "leadingSquare: positive integer",
      received: item.leadingSquare
    });
  }

  return true;
}

function validateSquaresRootsSource(items, branchKey, topicKey, levelKey, errors) {
  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (levelKey === "level1") {
      if (
        !Array.isArray(item) ||
        item.length !== 2 ||
        !item.every(isPositiveInteger) ||
        item[0] === item[1]
      ) {
        addConfigError(errors, {
          ...context,
          code: "SQUARES_ROOTS_MULTIPLICATION_PAIR",
          message: "Level 1 items must be two distinct positive integers.",
          expected: "[6, 7]",
          received: item
        });
      }
      return;
    }

    if (!isPositiveInteger(item)) {
      addConfigError(errors, {
        ...context,
        code: "SQUARES_ROOTS_VALUE",
        message: "This level requires a positive integer.",
        expected: "A positive integer such as 12.",
        received: item
      });
    }
  });
}

function validateVietaSource(items, branchKey, topicKey, levelKey, errors) {
  let ordinaryCount = 0;
  let doubleCount = 0;

  items.forEach(function (item, index) {
    const context = createItemContext(branchKey, topicKey, levelKey, index);

    if (!validateExactItemFields(item, ["roots"], context, errors)) {
      return;
    }

    if (!Array.isArray(item.roots) || item.roots.length !== 2) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_ROOTS_SHAPE",
        field: "roots",
        message: "roots must contain exactly two values.",
        expected: "roots: [root1, root2]",
        received: item.roots
      });
      return;
    }

    const [root1, root2] = item.roots;

    if (!Number.isInteger(root1) || !Number.isInteger(root2)) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_ROOTS_INTEGERS",
        field: "roots",
        message: "Both roots must be integers.",
        expected: "roots: [integer, integer]",
        received: item.roots
      });
      return;
    }

    if (levelKey === "level2") {
      if (root1 === 0 || root2 === 0) {
        addConfigError(errors, {
          ...context,
          code: "VIETA_L2_ROOTS_NON_ZERO",
          field: "roots",
          message: "Level 2 roots must be non-zero.",
          expected: "roots: [non-zero integer, non-zero integer]",
          received: item.roots
        });
        return;
      }

      if (Math.sign(root1) === Math.sign(root2)) {
        addConfigError(errors, {
          ...context,
          code: "VIETA_L2_ROOTS_OPPOSITE_SIGNS",
          field: "roots",
          message: "roots must have opposite signs.",
          expected: "roots: [positive integer, negative integer]",
          received: item.roots
        });
        return;
      }

      if (Math.abs(root1) > 7 || Math.abs(root2) > 7) {
        addConfigError(errors, {
          ...context,
          code: "VIETA_L2_ROOT_MAGNITUDE",
          field: "roots",
          message: "Root magnitudes must not exceed 7.",
          expected: "abs(root1) <= 7 and abs(root2) <= 7.",
          received: item.roots
        });
        return;
      }

      if (Math.abs(root1 * root2) > 30) {
        addConfigError(errors, {
          ...context,
          code: "VIETA_L2_PRODUCT_MAGNITUDE",
          field: "roots",
          message: "The product magnitude of the roots must not exceed 30.",
          expected: "abs(root1 * root2) <= 30.",
          received: item.roots
        });
      }
      return;
    }

    if (root1 <= 0 || root2 <= 0) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_POSITIVE_ROOTS",
        field: "roots",
        message: "This level requires positive roots.",
        expected: "roots: [positive integer, positive integer]",
        received: item.roots
      });
      return;
    }

    if (levelKey === "level1" && root1 === root2) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_L1_DISTINCT_ROOTS",
        field: "roots",
        message: "Level 1 roots must be distinct.",
        expected: "Two different positive roots.",
        received: item.roots
      });
      return;
    }

    if (root1 > 7 || root2 > 7) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_ROOT_MAGNITUDE",
        field: "roots",
        message: "Roots must not exceed 7.",
        expected: "root1 <= 7 and root2 <= 7.",
        received: item.roots
      });
      return;
    }

    if (root1 * root2 > 30) {
      addConfigError(errors, {
        ...context,
        code: "VIETA_PRODUCT",
        field: "roots",
        message: "The product of the roots must not exceed 30.",
        expected: "root1 * root2 <= 30.",
        received: item.roots
      });
      return;
    }

    if (levelKey === "level3") {
      if (root1 === root2) {
        doubleCount += 1;
      } else {
        ordinaryCount += 1;
      }
    }
  });

  if (levelKey === "level3") {
    if (ordinaryCount === 0) {
      addConfigError(errors, {
        code: "VIETA_L3_POOL_ORDINARY",
        branchKey,
        topicKey,
        levelKey,
        field: "source.items",
        message: "Level 3 needs at least one ordinary root pair.",
        expected: "At least one pair where root1 !== root2.",
        received: ordinaryCount
      });
    }

    if (doubleCount === 0) {
      addConfigError(errors, {
        code: "VIETA_L3_POOL_DOUBLE",
        branchKey,
        topicKey,
        levelKey,
        field: "source.items",
        message: "Level 3 needs at least one double-root pair.",
        expected: "At least one pair where root1 === root2.",
        received: doubleCount
      });
    }
  }
}

function validateExactItemFields(item, fields, context, errors, allowOptionalFields = false) {
  if (!isPlainObject(item)) {
    addConfigError(errors, {
      ...context,
      code: "SOURCE_ITEM_OBJECT",
      message: "Each source item must be an object.",
      expected: `{ ${fields.join(", ")} }`,
      received: item
    });
    return false;
  }

  const keys = Object.keys(item);
  const requiredFields = allowOptionalFields
    ? fields.filter(function (field) {
      return field !== "leadingSquare";
    })
    : fields;
  const hasRequiredFields = requiredFields.every(function (field) {
    return Object.prototype.hasOwnProperty.call(item, field);
  });
  const hasOnlyAllowedFields = keys.every(function (key) {
    return fields.includes(key);
  });

  if (!hasRequiredFields || !hasOnlyAllowedFields) {
    addConfigError(errors, {
      ...context,
      code: "SOURCE_ITEM_FIELDS",
      message: "This source item has missing or unsupported fields.",
      expected: `{ ${fields.join(", ")} }`,
      received: item
    });
    return false;
  }

  return true;
}

function createItemContext(branchKey, topicKey, levelKey, itemIndex) {
  return {
    branchKey,
    topicKey,
    levelKey,
    itemIndex: itemIndex + 1
  };
}

function addConfigError(errors, error) {
  errors.push(error);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function createVietaTask(root1, root2, knownRoot) {
  const p = -(root1 + root2);
  const q = root1 * root2;
  const answer = knownRoot === root1 ? root2 : root1;

  return {
    root1,
    root2,
    knownRoot,
    answer,
    p,
    q
  };
}

function formatVietaEquation(p, q) {
  let equation = "x²";

  if (p !== 0) {
    if (p === 1) {
      equation += " + x";
    } else if (p === -1) {
      equation += " − x";
    } else if (p > 0) {
      equation += ` + ${p}x`;
    } else {
      equation += ` − ${Math.abs(p)}x`;
    }
  }

  if (q > 0) {
    equation += ` + ${q}`;
  } else if (q < 0) {
    equation += ` − ${Math.abs(q)}`;
  }

  equation += " = 0";

  return equation;
}

function validateVietaTask(task) {
  if (!task) {
    return false;
  }

  const expectedP = -(task.root1 + task.root2);
  const expectedQ = task.root1 * task.root2;
  const roots = [task.root1, task.root2];

  return (
    Number.isInteger(task.root1) &&
    Number.isInteger(task.root2) &&
    task.p === expectedP &&
    task.q === expectedQ &&
    roots.includes(task.knownRoot) &&
    roots.includes(task.answer) &&
    (task.answer !== task.knownRoot || task.root1 === task.root2)
  );
}

function createVietaPairTask(root1, root2) {
  const p = -(root1 + root2);
  const q = root1 * root2;

  return {
    root1,
    root2,
    p,
    q,
    pairType: getVietaPairType(root1, root2)
  };
}

function getVietaPairType(root1, root2) {
  if (root1 === root2) {
    return "double";
  }

  if (root1 > 0 && root2 > 0) {
    return "ordinary";
  }

  if (root1 < 0 && root2 < 0) {
    return "negative";
  }

  return "mixed";
}

function validateVietaPairTask(task) {
  return (
    task &&
    Number.isInteger(task.root1) &&
    Number.isInteger(task.root2) &&
    task.root1 > 0 &&
    task.root2 > 0 &&
    task.root1 <= 7 &&
    task.root2 <= 7 &&
    task.p === -(task.root1 + task.root2) &&
    task.q === task.root1 * task.root2 &&
    task.q <= 30
  );
}

const VIETA_LEVELS = {
  level1: {
    mode: "singlePositiveRoot"
  },

  level2: {
    mode: "singleSignedRoot"
  },

  level3: {
    mode: "doubleRoot"
  }
};

let score = 0;
let correctCount = 0;
let wrongCount = 0;
let questionCount = 0;
let currentQuestion = null;
let questionTimer = null;
let questionDeadline = null;
let nextStepTimeout = null;
let levelPreviewTimeout = null;
let introTimeout = null;
let selectedBranchKey = null;
let selectedTopicKey = null;
let selectedLevelKey = null;
let currentScreenKey = null;
let currentBackTarget = null;
let screenGeneration = 0;
let activeTriples = [];
let triangleRoundQueue = [];
let activeProportions = [];
let proportionRoundQueue = [];
let activeExponentTasks = [];
let exponentRoundQueue = [];
let activeSquareIdentityTasks = [];
let squareIdentityRoundQueue = [];
let activeSquaresRootsTasks = [];
let squaresRootsRoundQueue = [];
let activeVietaTasks = [];
let vietaRoundQueue = [];
let audioContext = null;
let audioUnlocked = false;
let lastBeepSecond = null;
let isChecking = false;
let isQuestionResolved = false;

const focusTimeoutIds = new Set();
const soundTimeoutIds = new Set();

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  const validation = validateGameConfig(
    INITIAL_PROJECT_CONFIG,
    INITIAL_GAME_CONTENT
  );

  if (!validation.ok) {
    console.error("D_MATH BOOSTER configuration errors:", validation.errors);
    renderConfigErrors(
      validation.errors,
      INITIAL_PROJECT_CONFIG,
      INITIAL_GAME_CONTENT
    );
    return;
  }

  document.title = PROJECT_CONFIG.browserTitle;
  setupAudioUnlockListeners();
  showMathIntro();
}

function renderConfigErrors(errors, projectConfig, gameContent) {
  clearQuestionTimer();
  clearIntroTimeout();
  clearFocusTimeouts();
  clearSoundTimeouts();
  document.querySelector(".app-back-button")?.remove();
  document.body.classList.remove("has-global-back", "menu-scroll-enabled");
  document.body.classList.add("config-error-active");

  const screen = document.createElement("section");
  screen.className = "config-error-screen";
  screen.setAttribute("role", "alert");
  screen.setAttribute("aria-live", "assertive");

  const panel = document.createElement("div");
  panel.className = "config-error-panel";
  screen.appendChild(panel);

  const brand = document.createElement("div");
  brand.className = "config-error-brand";
  brand.textContent = getConfigErrorBrand(projectConfig);
  panel.appendChild(brand);

  const heading = document.createElement("h1");
  heading.className = "config-error-heading";
  heading.textContent = "CONFIG ERROR";
  panel.appendChild(heading);

  const count = document.createElement("p");
  count.className = "config-error-count";
  count.textContent = formatConfigErrorCount(errors.length);
  panel.appendChild(count);

  const list = document.createElement("ol");
  list.className = "config-error-list";

  errors.slice(0, CONFIG_ERROR_SCREEN_LIMIT).forEach(function (error) {
    list.appendChild(createConfigErrorItem(error, gameContent));
  });

  panel.appendChild(list);

  if (errors.length > CONFIG_ERROR_SCREEN_LIMIT) {
    const overflow = document.createElement("p");
    overflow.className = "config-error-overflow";
    overflow.textContent = `... and ${
      errors.length - CONFIG_ERROR_SCREEN_LIMIT
    } more. See browser console for the full list.`;
    panel.appendChild(overflow);
  }

  app.textContent = "";
  app.appendChild(screen);
}

function getConfigErrorBrand(projectConfig) {
  const splashLines = projectConfig?.splashLines;

  if (
    Array.isArray(splashLines) &&
    splashLines.length === 2 &&
    splashLines.every(isNonEmptyString)
  ) {
    return splashLines.join(" ");
  }

  return "D_MATH BOOSTER";
}

function formatConfigErrorCount(errorCount) {
  return `${errorCount} configuration error${
    errorCount === 1 ? "" : "s"
  } found`;
}

function createConfigErrorItem(error, gameContent) {
  const item = document.createElement("li");
  item.className = "config-error-item";

  const scope = document.createElement("div");
  scope.className = "config-error-scope";
  scope.textContent = formatConfigErrorScope(error, gameContent);
  item.appendChild(scope);

  const message = document.createElement("p");
  message.className = "config-error-message";
  message.textContent = error.message;
  item.appendChild(message);

  const expected = document.createElement("p");
  expected.className = "config-error-detail";
  expected.textContent = `Expected: ${formatConfigErrorValue(error.expected)}`;
  item.appendChild(expected);

  const received = document.createElement("p");
  received.className = "config-error-detail";
  received.textContent = `Received: ${formatConfigErrorValue(error.received)}`;
  item.appendChild(received);

  return item;
}

function formatConfigErrorScope(error, gameContent) {
  const parts = [];
  const topic = findConfigTopic(gameContent, error.topicKey);

  if (topic) {
    parts.push(topic.title);
  } else if (error.branchKey) {
    parts.push(`Branch: ${error.branchKey}`);
  } else {
    parts.push("Project configuration");
  }

  if (error.levelKey) {
    parts.push(`Level ${error.levelKey.replace("level", "")}`);
  }

  if (Number.isInteger(error.itemIndex)) {
    parts.push(`Item ${error.itemIndex}`);
  }

  return parts.join(" | ");
}

function findConfigTopic(gameContent, topicKey) {
  if (!topicKey || !Array.isArray(gameContent?.branches)) {
    return null;
  }

  for (const branch of gameContent.branches) {
    if (!Array.isArray(branch?.topics)) {
      continue;
    }

    const topic = branch.topics.find(function (candidate) {
      return candidate?.key === topicKey;
    });

    if (topic) {
      return topic;
    }
  }

  return null;
}

function formatConfigErrorValue(value) {
  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch {
    return String(value);
  }
}

function setMenuScrollEnabled(isEnabled) {
  document.body.classList.toggle("menu-scroll-enabled", isEnabled);
}

function setCurrentScreen(screenKey, backTarget = null) {
  currentScreenKey = screenKey;
  currentBackTarget = backTarget;
  screenGeneration += 1;

  syncGlobalBackButton();
}

function emitDMathEvent(name, detail = {}) {
  try {
    window.dispatchEvent(
      new CustomEvent(`dmath:${name}`, { detail })
    );
  } catch (_) {
    // Optional integrations must not affect gameplay.
  }
}

function syncGlobalBackButton() {
  document.querySelector(".app-back-button")?.remove();

  const shouldShow = Boolean(currentBackTarget);
  document.body.classList.toggle("has-global-back", shouldShow);

  if (!shouldShow) {
    return;
  }

  const button = document.createElement("button");

  button.type = "button";
  button.className = "app-back-button";
  button.setAttribute("aria-label", "Go back");
  button.title = "Back";

  button.innerHTML = `
    <span class="app-back-button-icon" aria-hidden="true">
      ←
    </span>
  `;

  button.addEventListener("click", function () {
    if (button.disabled) {
      return;
    }

    button.disabled = true;
    handleGlobalBack();
  });

  document.body.appendChild(button);
}

function scheduleIntroTransition(callback, durationMs) {
  clearIntroTimeout();

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (introTimeout === timeoutId) {
      introTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    callback();
  }, durationMs);

  introTimeout = timeoutId;
}

function showMathIntro() {
  setCurrentScreen("mathIntro", null);
  setMenuScrollEnabled(false);
  clearIntroTimeout();

  app.innerHTML = `
    <section class="intro-screen">
      <h1 class="intro-title math-logo-title">
        <span class="math-logo-main">${APP_TITLE}</span>
        <span class="math-logo-subtitle">${APP_SUBTITLE}</span>
      </h1>
    </section>
  `;

  scheduleIntroTransition(showBranchSelect, INTRO_MATH_DURATION_MS);
}

function getBranches() {
  return Array.isArray(GAME_CONTENT.branches) ? GAME_CONTENT.branches : [];
}

function getBranchByKey(branchKey) {
  return getBranches().find(function (branch) {
    return branch.key === branchKey;
  });
}

function getTopicsForBranch(branchKey) {
  const branch = getBranchByKey(branchKey);

  if (!branch) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown branch "${branchKey}".`
    );
  }

  return Array.isArray(branch.topics) ? branch.topics : [];
}

function getTopicByKey(topicKey) {
  for (const branch of getBranches()) {
    const topic = Array.isArray(branch.topics)
      ? branch.topics.find(function (item) {
          return item.key === topicKey;
        })
      : null;

    if (topic) {
      return topic;
    }
  }

  return null;
}

function getActiveTopic() {
  const topic = getTopicByKey(selectedTopicKey);

  if (!topic) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown topic "${selectedTopicKey}".`
    );
  }

  return topic;
}

function getLevelsForTopic(topicKey) {
  const topic = getTopicByKey(topicKey);

  if (!topic) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown topic "${topicKey}".`
    );
  }

  return Array.isArray(topic.levels) ? topic.levels : [];
}

function getLevelByKey(topicKey, levelKey) {
  return getLevelsForTopic(topicKey).find(function (level) {
    return level.key === levelKey;
  });
}

function getActiveLevelConfig() {
  const level = getLevelByKey(selectedTopicKey, selectedLevelKey);

  if (!level) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown level "${selectedLevelKey}" for topic "${selectedTopicKey}".`
    );
  }

  return level;
}

function getActiveLevelSource() {
  const levelConfig = getActiveLevelConfig();
  const source = levelConfig.source;

  if (!source) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: missing source for ${selectedTopicKey}/${selectedLevelKey}.`
    );
  }

  if (source.kind !== "pool") {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unsupported source kind "${source.kind}" for ${selectedTopicKey}/${selectedLevelKey}.`
    );
  }

  if (!Array.isArray(source.items)) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: source items must be an array for ${selectedTopicKey}/${selectedLevelKey}.`
    );
  }

  if (source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: source items are empty for ${selectedTopicKey}/${selectedLevelKey}.`
    );
  }

  return source;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function showBranchSelect() {
  setCurrentScreen("branchSelect", null);
  setMenuScrollEnabled(false);
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();
  clearFocusTimeouts();
  selectedBranchKey = null;
  selectedTopicKey = null;
  selectedLevelKey = null;
  activeTriples = [];
  triangleRoundQueue = [];
  activeProportions = [];
  activeExponentTasks = [];
  activeSquareIdentityTasks = [];
  activeSquaresRootsTasks = [];
  activeVietaTasks = [];
  squareIdentityRoundQueue = [];
  squaresRootsRoundQueue = [];
  vietaRoundQueue = [];
  currentQuestion = null;
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = false;
  isQuestionResolved = false;

  app.innerHTML = `
    <section class="branch-screen">
      <h1 class="branch-title">${APP_TITLE}</h1>

      <div class="branch-buttons">
        ${getBranches().map(function (branch) {
          return `
            <button class="branch-button" type="button" data-branch="${escapeHtml(branch.key)}">
              ${escapeHtml(branch.title)}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll(".branch-button").forEach(function (button) {
    button.addEventListener("click", function () {
      selectBranch(button.dataset.branch);
    });
  });
}

function selectBranch(branchKey) {
  selectedBranchKey = branchKey;
  showTopicSelect();
}

function showTopicSelect() {
  setCurrentScreen("topicSelect", "branchSelect");
  setMenuScrollEnabled(true);
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();
  clearFocusTimeouts();
  currentQuestion = null;
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = false;
  isQuestionResolved = false;

  const branch = getBranchByKey(selectedBranchKey);

  if (!branch) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown branch "${selectedBranchKey}".`
    );
  }

  const topics = getTopicsForBranch(selectedBranchKey);

  app.innerHTML = `
    <section class="topic-screen">
      <h1 class="topic-title">${escapeHtml(branch.title)}</h1>

      <div class="topic-buttons">
        ${topics.map(function (topic) {
          return `
            <button class="topic-button" type="button" data-topic="${escapeHtml(topic.key)}">
              ${renderTopicButtonTitle(topic)}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll(".topic-button").forEach(function (button) {
    button.addEventListener("click", function () {
      selectTopic(button.dataset.topic);
    });
  });
}

function renderTopicButtonTitle(topic) {
  if (topic.titleLines && topic.titleLines.length > 0) {
    return topic.titleLines.map(function (line) {
      return `<span>${escapeHtml(line)}</span>`;
    }).join("");
  }

  return escapeHtml(topic.title);
}

function selectTopic(topicKey) {
  setMenuScrollEnabled(false);
  selectedTopicKey = topicKey;
  showTopicIntro();
}

function showTopicIntro() {
  setCurrentScreen("topicIntro", "topicSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const topic = getTopicByKey(selectedTopicKey);

  if (!topic) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown topic "${selectedTopicKey}".`
    );
  }

  const intro = topic.intro || {};
  const lines = Array.isArray(intro.lines) && intro.lines.length > 0
    ? intro.lines
    : [topic.title];
  const introClassName = ["intro-title", intro.className]
    .filter(Boolean)
    .join(" ");

  app.innerHTML = `
    <section class="intro-screen">
      <div class="${escapeHtml(introClassName)}">
        ${lines.map(function (line) {
          return `<span>${escapeHtml(line)}</span>`;
        }).join("")}
      </div>
    </section>
  `;

  scheduleIntroTransition(showLevelSelect, INTRO_SECTION_DURATION_MS);
}

function showLevelSelect() {
  setCurrentScreen("levelSelect", "topicSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();
  clearFocusTimeouts();
  currentQuestion = null;
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = false;
  isQuestionResolved = false;

  const topic = getActiveTopic();
  const levels = getLevelsForTopic(topic.key);

  setMenuScrollEnabled(levels.length > 3);

  app.innerHTML = `
    <section class="level-screen">
      <h1>Choose Level</h1>
      <div class="level-buttons">
        ${levels.map(function (level) {
          return `
            <button class="level-button" type="button" data-level="${escapeHtml(level.key)}">
              ${escapeHtml(level.title)}
              ${level.label ? `<span>${escapeHtml(level.label)}</span>` : ""}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll(".level-button").forEach(function (button) {
    button.addEventListener("click", async function () {
      await selectLevel(button.dataset.level);
    });
  });
}

async function selectLevel(levelKey) {
  const level = getLevelByKey(selectedTopicKey, levelKey);

  if (!level) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown level "${levelKey}" for topic "${selectedTopicKey}".`
    );
  }

  await unlockAudio();
  setMenuScrollEnabled(false);
  selectedLevelKey = level.key;

  if (selectedTopicKey === "vieta") {
    activeTriples = [];
    activeProportions = [];
    activeExponentTasks = [];
    activeSquareIdentityTasks = [];
    activeSquaresRootsTasks = [];
    activeVietaTasks = levelKey === "level1"
      ? buildVietaLevel1TaskPool()
      : levelKey === "level2"
        ? buildVietaLevel2TaskPool()
        : buildVietaLevel3TaskPool();
    vietaRoundQueue = [];
    showPreview();
    return;
  }

  if (selectedTopicKey === "proportions") {
    activeProportions = buildProportionPool();
    activeTriples = [];
    activeExponentTasks = [];
    activeSquareIdentityTasks = [];
    activeSquaresRootsTasks = [];
    activeVietaTasks = [];
  } else if (selectedTopicKey === "exponents") {
    activeExponentTasks = buildExponentTaskPool();
    activeTriples = [];
    activeProportions = [];
    activeSquareIdentityTasks = [];
    activeSquaresRootsTasks = [];
    activeVietaTasks = [];
  } else if (selectedTopicKey === "squareIdentities") {
    activeSquareIdentityTasks = buildSquareIdentityTaskPool();
    squareIdentityRoundQueue = [];
    activeTriples = [];
    activeProportions = [];
    activeExponentTasks = [];
    activeSquaresRootsTasks = [];
    activeVietaTasks = [];
  } else if (selectedTopicKey === "squaresRoots") {
    activeSquaresRootsTasks = buildSquaresRootsTaskPool();
    squaresRootsRoundQueue = [];
    activeTriples = [];
    activeProportions = [];
    activeExponentTasks = [];
    activeSquareIdentityTasks = [];
    activeVietaTasks = [];
  } else {
    activeTriples = buildTriangleTaskPool();
    triangleRoundQueue = [];
    activeProportions = [];
    activeExponentTasks = [];
    activeSquareIdentityTasks = [];
    activeSquaresRootsTasks = [];
    activeVietaTasks = [];
  }

  showPreview();
}

function showPreview() {
  if (selectedTopicKey === "vieta") {
    showVietaPreview();
    return;
  }

  if (selectedTopicKey === "proportions") {
    showProportionPreview();
    return;
  }

  if (selectedTopicKey === "exponents") {
    showExponentPreview();
    return;
  }

  if (selectedTopicKey === "squareIdentities") {
    showSquareIdentitiesPreview();
    return;
  }

  if (selectedTopicKey === "squaresRoots") {
    showSquaresRootsPreview();
    return;
  }

  showLevelPreview();
}

function showLevelPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();
  const previewTriples = activeTriples.length > 0
    ? activeTriples
    : buildTriangleTaskPool();

  app.innerHTML = `
    <section class="level-preview-screen">
      <div class="level-preview-title">${activeLevel.title}</div>
      <div class="level-preview-subtitle">${activeLevel.label}</div>
      <div class="level-preview-list">
        ${previewTriples
          .map(function (triple) {
            return `
              <div class="level-preview-item">${triple.a}-${triple.b}-${triple.c}</div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, LEVEL_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function showProportionPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="level-preview-screen proportion-preview-screen">
      <div class="level-preview-title proportion-preview-title">${activeLevel.title}</div>
      <div class="level-preview-subtitle proportion-preview-subtitle">${activeLevel.label}</div>
      <div class="proportion-example" aria-label="Proportion example">
        <span class="proportion-example-fraction">
          <span>1</span>
          <span></span>
          <span>2</span>
        </span>
        <span>=</span>
        <span class="proportion-example-fraction">
          <span>x</span>
          <span></span>
          <span>4</span>
        </span>
      </div>
      <div class="proportion-preview-hint">x = 2</div>
      <div class="proportion-preview-hint">Find the missing number</div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, PROPORTION_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function showExponentPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="exponent-preview-screen">
      <div class="exponent-preview-title">${activeLevel.title}</div>
      <div class="exponent-preview-subtitle">${activeLevel.label}</div>
      <div class="exponent-preview-example">${getExponentPreviewText()}</div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, EXPONENT_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function getExponentPreviewText() {
  if (selectedLevelKey === "level2") {
    return "10³ × 10⁻² = 10[ ]";
  }

  if (selectedLevelKey === "level3") {
    return "2 × 10[3] × 10⁻² = 20";
  }

  return "2 × 10³ × 10⁻² = 20";
}

function showSquareIdentitiesPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="square-identities-preview-screen">
      <div class="square-identities-preview-title">${activeLevel.title}</div>
      <div class="square-identities-preview-subtitle">${activeLevel.label}</div>
      <div class="square-identities-formulas">
        <div>a² − b² = (a − b)(a + b)</div>
        <div>a² − 2ab + b² = (a − b)²</div>
        <div>a² + 2ab + b² = (a + b)²</div>
      </div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, SQUARE_IDENTITIES_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function showSquaresRootsPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();
  const levelPolicy =
    SQUARES_ROOTS_LEVELS[selectedLevelKey] || SQUARES_ROOTS_LEVELS.level1;

  app.innerHTML = `
    <section class="squares-roots-preview-screen">
      <div class="squares-roots-preview-title">${activeLevel.title}</div>
      <div class="squares-roots-preview-subtitle">${activeLevel.label}</div>
      <div class="squares-roots-preview-example">${levelPolicy.preview}</div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, SQUARES_ROOTS_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function showVietaPreview() {
  setCurrentScreen("preview", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="vieta-preview-screen">
      <div class="vieta-preview-title">${activeLevel.title}</div>
      <div class="vieta-preview-subtitle">${activeLevel.label}</div>
      <div class="vieta-preview-formulas">
        <div>x² + px + q = 0</div>
        <div>x₁ + x₂ = −p</div>
        <div>x₁ * x₂ = q</div>
      </div>
    </section>
  `;

  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (levelPreviewTimeout === timeoutId) {
      levelPreviewTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    startGame();
  }, VIETA_PREVIEW_DURATION_MS);

  levelPreviewTimeout = timeoutId;
}

function showVietaComingSoon() {
  setCurrentScreen("stub", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();

  const activeLevel = getActiveLevelConfig();
  const branch = getBranchByKey(selectedBranchKey);

  if (!branch) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: unknown branch "${selectedBranchKey}".`
    );
  }

  app.innerHTML = `
    <section class="topic-stub-screen vieta-stub-screen">
      <div class="topic-stub-title">${activeLevel.title}</div>
      <div class="topic-stub-text">Coming soon</div>
      <div class="vieta-stub-actions">
        <button class="topic-back-button vieta-levels-button" type="button">
          Levels
        </button>
        <button class="topic-back-button vieta-topics-button" type="button">
          ${escapeHtml(branch.title)}
        </button>
      </div>
    </section>
  `;

  const levelsButton = document.querySelector(".vieta-levels-button");
  const topicsButton = document.querySelector(".vieta-topics-button");

  if (levelsButton) {
    levelsButton.addEventListener("click", showLevelSelect);
  }

  if (topicsButton) {
    topicsButton.addEventListener("click", showTopicSelect);
  }
}

function startGame() {
  setCurrentScreen("game", "levelSelect");
  clearIntroTimeout();
  clearLevelPreviewTimeout();

  if (selectedTopicKey === "proportions") {
    if (!activeProportions || activeProportions.length === 0) {
      selectedLevelKey = "level1";
      activeProportions = buildProportionPool();
    }
  } else if (selectedTopicKey === "exponents") {
    if (!activeExponentTasks || activeExponentTasks.length === 0) {
      selectedLevelKey = "level1";
      activeExponentTasks = buildExponentTaskPool();
    }
  } else if (selectedTopicKey === "squareIdentities") {
    if (!activeSquareIdentityTasks || activeSquareIdentityTasks.length === 0) {
      selectedLevelKey = "level1";
      activeSquareIdentityTasks = buildSquareIdentityTaskPool();
    }
  } else if (selectedTopicKey === "squaresRoots") {
    if (!activeSquaresRootsTasks || activeSquaresRootsTasks.length === 0) {
      selectedLevelKey = "level1";
      activeSquaresRootsTasks = buildSquaresRootsTaskPool();
    }
  } else if (selectedTopicKey === "vieta") {
    if (!activeVietaTasks || activeVietaTasks.length === 0) {
      selectedLevelKey = "level1";
      activeVietaTasks = buildVietaLevel1TaskPool();
    }
  } else if (!activeTriples || activeTriples.length === 0) {
    selectedLevelKey = "level1";
    activeTriples = buildTriangleTaskPool();
  }

  resetRoundState();
  if (selectedTopicKey === "proportions") {
    prepareProportionRoundQueue();
  }
  if (selectedTopicKey === "exponents") {
    prepareExponentRoundQueue();
  }
  if (selectedTopicKey === "squareIdentities") {
    prepareSquareIdentityRoundQueue();
  }
  if (selectedTopicKey === "squaresRoots") {
    prepareSquaresRootsRoundQueue();
  }
  if (selectedTopicKey === "vieta") {
    prepareVietaRoundQueue();
  }
  if (selectedTopicKey === "triangles") {
    prepareTriangleRoundQueue();
  }
  emitDMathEvent("round-started", {
    topicKey: selectedTopicKey,
    levelKey: selectedLevelKey
  });
  nextQuestion();
}

function resetRoundState() {
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  questionCount = 0;
  currentQuestion = null;
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = false;
  isQuestionResolved = false;
  clearActiveQuestionQueues();
  clearQuestionTimer();
  clearNextStepTimeout();
}

function generateQuestion() {
  if (selectedTopicKey === "proportions") {
    generateProportionQuestion();
    return;
  }

  if (selectedTopicKey === "exponents") {
    generateExponentQuestion();
    return;
  }

  if (selectedTopicKey === "squareIdentities") {
    generateSquareIdentityQuestion();
    return;
  }

  if (selectedTopicKey === "squaresRoots") {
    generateSquaresRootsQuestion();
    return;
  }

  if (selectedTopicKey === "vieta") {
    generateVietaQuestion();
    return;
  }

  generateTriangleQuestion();
}

function generateTriangleQuestion() {
  if (!activeTriples || activeTriples.length === 0) {
    selectedLevelKey = "level1";
    activeTriples = buildTriangleTaskPool();
  }

  if (!triangleRoundQueue || triangleRoundQueue.length === 0) {
    prepareTriangleRoundQueue();
  }

  const triple = triangleRoundQueue.shift();
  const sides = ["a", "b", "c"];
  const unknownSide = randomItem(sides);

  currentQuestion = {
    type: "triangle",
    triple,
    unknownSide,
    answer: triple[unknownSide]
  };
}

function buildTriangleTaskPool() {
  const source = getActiveLevelSource();

  if (!source || !Array.isArray(source.items) || source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: triangles/${selectedLevelKey} source must contain at least one triple.`
    );
  }

  return source.items.map(function (triple, index) {
    validateTriangleSourceTriple(triple, index);

    return {
      a: triple.a,
      b: triple.b,
      c: triple.c
    };
  });
}

function validateTriangleSourceTriple(triple, index) {
  const location = `triangles/${selectedLevelKey} source item ${index + 1}`;
  const expectedKeys = ["a", "b", "c"];

  if (
    !triple ||
    Array.isArray(triple) ||
    typeof triple !== "object" ||
    Object.keys(triple).length !== expectedKeys.length ||
    !expectedKeys.every(function (key) {
      return Object.prototype.hasOwnProperty.call(triple, key);
    })
  ) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must be exactly { a, b, c }.`
    );
  }

  if (!expectedKeys.every(function (key) {
    return Number.isInteger(triple[key]) && triple[key] > 0;
  })) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must contain positive integer sides.`
    );
  }

  if (triple.a * triple.a + triple.b * triple.b !== triple.c * triple.c) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must satisfy a² + b² = c² with c as the hypotenuse.`
    );
  }
}

function prepareTriangleRoundQueue() {
  triangleRoundQueue = buildRoundFromPool(
    activeTriples,
    QUESTIONS_PER_ROUND
  );
}

function generateProportionQuestion() {
  if (!activeProportions || activeProportions.length === 0) {
    selectedLevelKey = "level1";
    activeProportions = buildProportionPool();
  }

  if (!proportionRoundQueue || proportionRoundQueue.length === 0) {
    prepareProportionRoundQueue();
  }

  const proportion = proportionRoundQueue.shift();
  const hiddenKey = randomItem(["a", "b", "c", "d"]);

  currentQuestion = {
    type: "proportion",
    a: hiddenKey === "a" ? null : proportion.a,
    b: hiddenKey === "b" ? null : proportion.b,
    c: hiddenKey === "c" ? null : proportion.c,
    d: hiddenKey === "d" ? null : proportion.d,
    answer: proportion[hiddenKey],
    hiddenKey
  };
}

function buildProportionPool() {
  const source = getActiveLevelSource();

  return source.items.map(function (item, index) {
    validateProportionSourceItem(item, index);

    return {
      a: item.a,
      b: item.b,
      c: item.c,
      d: item.d
    };
  });
}

function prepareProportionRoundQueue() {
  proportionRoundQueue = buildRoundFromPool(
    activeProportions,
    QUESTIONS_PER_ROUND
  );
}

function validateProportionSourceItem(item, index) {
  const location = `${selectedTopicKey}/${selectedLevelKey} source item ${index + 1}`;

  if (!item || ![item.a, item.b, item.c, item.d].every(Number.isInteger)) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must contain integer a, b, c, and d values.`
    );
  }

  if (item.b === 0 || item.d === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must have non-zero b and d denominators.`
    );
  }

  if (item.a * item.d !== item.b * item.c) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: ${location} must satisfy a * d === b * c.`
    );
  }
}

function generateExponentQuestion() {
  if (!activeExponentTasks || activeExponentTasks.length === 0) {
    selectedLevelKey = "level1";
    activeExponentTasks = buildExponentTaskPool();
  }

  if (!exponentRoundQueue || exponentRoundQueue.length === 0) {
    prepareExponentRoundQueue();
  }

  const task = exponentRoundQueue.shift();

  currentQuestion = {
    type: "exponent",
    ...task
  };
}

function buildExponentTaskPool() {
  const source = getActiveLevelSource();

  return source.items.map(function (task) {
    return {
      ...task
    };
  });
}

function prepareExponentRoundQueue() {
  exponentRoundQueue = buildRoundFromPool(
    activeExponentTasks,
    QUESTIONS_PER_ROUND
  );
}

function generateSquareIdentityQuestion() {
  if (!squareIdentityRoundQueue || squareIdentityRoundQueue.length === 0) {
    prepareSquareIdentityRoundQueue();
  }

  currentQuestion = squareIdentityRoundQueue.shift();
}

function buildSquareIdentityTaskPool() {
  const level =
    SQUARE_IDENTITY_LEVELS[selectedLevelKey] || SQUARE_IDENTITY_LEVELS.level1;
  const source = getActiveLevelSource();

  if (!Array.isArray(source.items) || source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: square identity source must contain at least one task.`
    );
  }

  validateSquareIdentityTasks(source.items, level.mode);

  return source.items.map(function (task) {
    return {
      ...task,
      ...(Array.isArray(task.choices) ? { choices: [...task.choices] } : {})
    };
  });
}

function validateSquareIdentityTasks(tasks, mode) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: square identity source must contain at least one task.`
    );
  }

  if (mode === "category") {
    const foundKinds = new Set();

    tasks.forEach(function (task) {
      if (
        !task ||
        !SQUARE_IDENTITY_ANSWER_KINDS.includes(task.answerKind)
      ) {
        throw new Error(
          `${PROJECT_CONFIG.browserTitle}: square identity category tasks must use a supported answerKind.`
        );
      }

      foundKinds.add(task.answerKind);
    });

    const missingKind = SQUARE_IDENTITY_ANSWER_KINDS.find(function (answerKind) {
      return !foundKinds.has(answerKind);
    });

    if (missingKind) {
      throw new Error(
        `${PROJECT_CONFIG.browserTitle}: square identity category source must include at least one ${missingKind} task.`
      );
    }

    return;
  }

  if (mode === "exactChoice") {
    const foundIndexes = new Set();

    tasks.forEach(function (task) {
      if (!task || !Array.isArray(task.choices) || task.choices.length === 0) {
        throw new Error(
          `${PROJECT_CONFIG.browserTitle}: square identity choice tasks must include a non-empty choices array.`
        );
      }

      if (
        !Number.isInteger(task.correctIndex) ||
        task.correctIndex < 0 ||
        task.correctIndex >= task.choices.length
      ) {
        throw new Error(
          `${PROJECT_CONFIG.browserTitle}: square identity correctIndex must be an integer within the choices array.`
        );
      }

      foundIndexes.add(task.correctIndex);
    });

    const missingIndex = [0, 1, 2].find(function (correctIndex) {
      return !foundIndexes.has(correctIndex);
    });

    if (missingIndex !== undefined) {
      throw new Error(
        `${PROJECT_CONFIG.browserTitle}: square identity three-choice source must include at least one task for correctIndex ${missingIndex}.`
      );
    }
  }
}

function buildSquaresRootsTaskPool() {
  const level =
    SQUARES_ROOTS_LEVELS[selectedLevelKey] || SQUARES_ROOTS_LEVELS.level1;
  const source = getActiveLevelSource();
  const items = source.items;

  if (level.mode === "multiplication") {
    if (
      items.some(function (pair) {
        return (
          !Array.isArray(pair) ||
          pair.length !== 2 ||
          !pair.every(function (value) {
            return Number.isInteger(value) && value > 0;
          }) ||
          pair[0] === pair[1]
        );
      })
    ) {
      throw new Error(
        `${PROJECT_CONFIG.browserTitle}: multiplication pairs for squaresRoots/${selectedLevelKey} must be [a, b] with distinct positive integers.`
      );
    }

    return items.map(function ([left, right]) {
      return {
        type: "squaresRoots",
        mode: "multiplication",
        left,
        right,
        expression: `${left} × ${right}`,
        answer: left * right
      };
    });
  }

  if (level.mode === "square") {
    if (
      !items.every(function (value) {
        return Number.isInteger(value) && value > 0;
      })
    ) {
      throw new Error(
        `${PROJECT_CONFIG.browserTitle}: square values for squaresRoots/${selectedLevelKey} must be positive integers.`
      );
    }

    return items.map(function (value) {
      return {
        type: "squaresRoots",
        mode: "square",
        value,
        expression: `${value}²`,
        answer: value * value
      };
    });
  }

  if (level.mode === "root") {
    if (
      !items.every(function (value) {
        return Number.isInteger(value) && value > 0;
      })
    ) {
      throw new Error(
        `${PROJECT_CONFIG.browserTitle}: root values for squaresRoots/${selectedLevelKey} must be positive integers.`
      );
    }

    return items.map(function (value) {
      return {
        type: "squaresRoots",
        mode: "root",
        value,
        expression: `√${value * value}`,
        answer: value
      };
    });
  }

  return [];
}

function prepareSquaresRootsRoundQueue() {
  const activeLevel =
    SQUARES_ROOTS_LEVELS[selectedLevelKey] || SQUARES_ROOTS_LEVELS.level1;
  const queue = activeLevel.mode === "multiplication"
    ? buildMultiplicationRoundQueue(
      activeSquaresRootsTasks,
      QUESTIONS_PER_ROUND
    )
    : buildSquaresRootsValueRoundQueue(
      activeSquaresRootsTasks,
      QUESTIONS_PER_ROUND
    );

  squaresRootsRoundQueue = queue
    .map(function (task) {
      return {
        ...task
      };
    });
}

function buildMultiplicationRoundQueue(tasks, roundLength, rng = Math.random) {
  let bestQueue = [];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const baseQueue = buildRoundFromPool(tasks, roundLength, rng);
    const candidateQueue = spreadMultiplicationRoundQueue(
      baseQueue,
      tasks.length,
      rng
    );
    const score = countSquaresRootsNeighborPenalty(candidateQueue);

    if (score < bestScore) {
      bestQueue = candidateQueue;
      bestScore = score;
    }

    if (bestScore === 0) {
      break;
    }
  }

  return bestQueue;
}

function spreadMultiplicationRoundQueue(queue, sourcePoolSize, rng) {
  const arrangedQueue = [];

  for (let start = 0; start < queue.length; start += sourcePoolSize) {
    const cycle = queue.slice(start, start + sourcePoolSize);
    const previousTask = arrangedQueue[arrangedQueue.length - 1] || null;

    arrangedQueue.push(
      ...arrangeSquaresRootsRoundQueue(cycle, previousTask, rng)
    );
  }

  return arrangedQueue;
}

function buildSquaresRootsValueRoundQueue(tasks, roundLength, rng = Math.random) {
  return buildRoundFromPool(tasks, roundLength, rng);
}

function arrangeSquaresRootsRoundQueue(tasks, initialPreviousTask = null, rng = Math.random) {
  const remainingTasks = [...tasks];
  const arrangedTasks = [];

  while (remainingTasks.length > 0) {
    const previousTask =
      arrangedTasks[arrangedTasks.length - 1] || initialPreviousTask;
    let bestIndexes = [];
    let bestScore = Number.POSITIVE_INFINITY;

    remainingTasks.forEach(function (task, index) {
      const score = previousTask
        ? getSquaresRootsNeighborPenalty(previousTask, task)
        : 0;

      if (score < bestScore) {
        bestScore = score;
        bestIndexes = [index];
      } else if (score === bestScore) {
        bestIndexes.push(index);
      }
    });

    const selectedIndex = randomItem(bestIndexes, rng);
    const selectedTasks = remainingTasks.splice(selectedIndex, 1);
    arrangedTasks.push(selectedTasks[0]);
  }

  return arrangedTasks;
}

function countSquaresRootsNeighborPenalty(tasks) {
  return tasks.reduce(function (total, task, index) {
    if (index === 0) {
      return total;
    }

    return total + getSquaresRootsNeighborPenalty(tasks[index - 1], task);
  }, 0);
}

function getSquaresRootsNeighborPenalty(previousTask, task) {
  const sameExpression = previousTask.expression === task.expression;
  const sameAnswer = previousTask.answer === task.answer;
  const samePair =
    previousTask.mode === "multiplication" &&
    task.mode === "multiplication" &&
    getMultiplicationPairKey(previousTask) === getMultiplicationPairKey(task);

  return (
    (sameExpression ? 8 : 0) +
    (samePair ? 8 : 0) +
    (sameAnswer ? 4 : 0)
  );
}

function getMultiplicationPairKey(task) {
  return [task.left, task.right]
    .sort(function (a, b) {
      return a - b;
    })
    .join("-");
}

function generateSquaresRootsQuestion() {
  if (!squaresRootsRoundQueue || squaresRootsRoundQueue.length === 0) {
    prepareSquaresRootsRoundQueue();
  }

  currentQuestion = squaresRootsRoundQueue.shift();
}

function prepareVietaRoundQueue() {
  if (!activeVietaTasks || activeVietaTasks.length === 0) {
    vietaRoundQueue = [];
    return;
  }

  vietaRoundQueue = buildVietaRoundQueue(
    activeVietaTasks,
    selectedLevelKey,
    QUESTIONS_PER_ROUND
  ).map(function (task) {
    return {
      ...task
    };
  });
}

function buildVietaLevel1TaskPool() {
  const source = getActiveLevelSource();

  if (!source || !Array.isArray(source.items) || source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 1\n\nExpected at least one root pair.`
    );
  }

  return source.items.map(function (item, index) {
    validateVietaLevel1SourceItem(item, index);

    return {
      roots: [...item.roots]
    };
  });
}

function buildVietaLevel2TaskPool() {
  const source = getActiveLevelSource();

  if (!source || !Array.isArray(source.items) || source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 2\n\nExpected at least one root pair.`
    );
  }

  return source.items.map(function (item, index) {
    validateVietaLevel2SourceItem(item, index);

    return {
      roots: [...item.roots]
    };
  });
}

function buildVietaLevel3TaskPool() {
  const source = getActiveLevelSource();

  if (!source || !Array.isArray(source.items) || source.items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 3\n\nExpected at least one root pair.`
    );
  }

  return source.items.map(function (item, index) {
    validateVietaLevel3SourceItem(item, index);

    return createVietaPairTask(item.roots[0], item.roots[1]);
  });
}

function validateVietaLevel1SourceItem(item, index) {
  const location = `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 1\nItem: ${index + 1}`;

  if (
    !item ||
    Array.isArray(item) ||
    typeof item !== "object" ||
    Object.keys(item).length !== 1 ||
    !Object.prototype.hasOwnProperty.call(item, "roots") ||
    !Array.isArray(item.roots) ||
    item.roots.length !== 2
  ) {
    throw new Error(`${location}\n\nExpected { roots: [root1, root2] }.`);
  }

  const [root1, root2] = item.roots;

  if (!Number.isInteger(root1) || !Number.isInteger(root2)) {
    throw new Error(`${location}\n\nRoots must be integers.`);
  }

  if (root1 <= 0 || root2 <= 0) {
    throw new Error(`${location}\n\nRoots must be positive.`);
  }

  if (root1 === root2) {
    throw new Error(`${location}\n\nLevel 1 roots must be distinct.`);
  }

  if (root1 > 7 || root2 > 7) {
    throw new Error(`${location}\n\nRoots must not exceed 7.`);
  }

  if (root1 * root2 > 30) {
    throw new Error(`${location}\n\nThe product of the roots must not exceed 30.`);
  }
}

function validateVietaLevel2SourceItem(item, index) {
  const location = `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 2\nItem: ${index + 1}`;

  if (
    !item ||
    Array.isArray(item) ||
    typeof item !== "object" ||
    Object.keys(item).length !== 1 ||
    !Object.prototype.hasOwnProperty.call(item, "roots") ||
    !Array.isArray(item.roots) ||
    item.roots.length !== 2
  ) {
    throw new Error(`${location}\n\nExpected { roots: [root1, root2] }.`);
  }

  const [root1, root2] = item.roots;

  if (!Number.isInteger(root1) || !Number.isInteger(root2)) {
    throw new Error(`${location}\n\nRoots must be integers.`);
  }

  if (root1 === 0 || root2 === 0) {
    throw new Error(`${location}\n\nRoots must be non-zero.`);
  }

  if (Math.sign(root1) === Math.sign(root2)) {
    throw new Error(`${location}\n\nRoots must have opposite signs.`);
  }

  if (Math.abs(root1) > 7 || Math.abs(root2) > 7) {
    throw new Error(`${location}\n\nRoot magnitudes must not exceed 7.`);
  }

  if (Math.abs(root1 * root2) > 30) {
    throw new Error(`${location}\n\nThe product magnitude of the roots must not exceed 30.`);
  }
}

function validateVietaLevel3SourceItem(item, index) {
  const location = `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 3\nItem: ${index + 1}`;

  if (
    !item ||
    Array.isArray(item) ||
    typeof item !== "object" ||
    Object.keys(item).length !== 1 ||
    !Object.prototype.hasOwnProperty.call(item, "roots") ||
    !Array.isArray(item.roots) ||
    item.roots.length !== 2
  ) {
    throw new Error(`${location}\n\nExpected { roots: [root1, root2] }.`);
  }

  const [root1, root2] = item.roots;

  if (!Number.isInteger(root1) || !Number.isInteger(root2)) {
    throw new Error(`${location}\n\nRoots must be integers.`);
  }

  if (root1 <= 0 || root2 <= 0) {
    throw new Error(`${location}\n\nRoots must be positive.`);
  }

  if (root1 > 7 || root2 > 7) {
    throw new Error(`${location}\n\nRoots must not exceed 7.`);
  }

  if (root1 * root2 > 30) {
    throw new Error(`${location}\n\nThe product of the roots must not exceed 30.`);
  }
}

function buildVietaRoundQueue(
  tasks,
  levelKey,
  roundLength,
  rng = Math.random
) {
  if (levelKey === "level1") {
    return buildVietaLevel1RoundQueue(tasks, roundLength, rng);
  }

  if (levelKey === "level2") {
    return buildVietaLevel2RoundQueue(tasks, roundLength, rng);
  }

  let bestQueue = [];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = buildVietaRoundCandidate(
      tasks,
      levelKey,
      roundLength,
      rng
    );
    const arrangedCandidate = arrangeVietaRoundQueue(candidate, levelKey, rng);
    const score = getVietaQueuePenalty(arrangedCandidate, levelKey);

    if (score < bestScore) {
      bestQueue = arrangedCandidate;
      bestScore = score;
    }

    if (bestScore === 0) {
      break;
    }
  }

  return bestQueue;
}

function buildVietaLevel1RoundQueue(rootPairs, roundLength, rng = Math.random) {
  let bestQueue = [];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const selectedPairs = buildRoundFromPool(rootPairs, roundLength, rng);
    const candidateTasks = selectedPairs.map(function (pair) {
      return createVietaLevel1PresentationTask(pair, rng);
    });
    const arrangedCandidate = arrangeVietaRoundQueue(
      candidateTasks,
      "level1",
      rng
    );
    const score = getVietaQueuePenalty(arrangedCandidate, "level1");

    if (score < bestScore) {
      bestQueue = arrangedCandidate;
      bestScore = score;
    }

    if (bestScore === 0) {
      break;
    }
  }

  return bestQueue;
}

function createVietaLevel1PresentationTask(pair, rng = Math.random) {
  const [root1, root2] = pair.roots;
  const knownRoot = randomItem(pair.roots, rng);

  return createVietaTask(root1, root2, knownRoot);
}

function buildVietaLevel2RoundQueue(rootPairs, roundLength, rng = Math.random) {
  const presentationTasks = rootPairs.flatMap(function (pair) {
    return createVietaLevel2PresentationTasks(pair);
  });

  let bestQueue = [];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = buildVietaRoundCandidate(
      presentationTasks,
      "level2",
      roundLength,
      rng
    );
    const arrangedCandidate = arrangeVietaRoundQueue(candidate, "level2", rng);
    const score = getVietaQueuePenalty(arrangedCandidate, "level2");

    if (score < bestScore) {
      bestQueue = arrangedCandidate;
      bestScore = score;
    }

    if (bestScore === 0) {
      break;
    }
  }

  return bestQueue;
}

function createVietaLevel2PresentationTasks(pair) {
  const [root1, root2] = pair.roots;

  return [
    createVietaTask(root1, root2, root1),
    createVietaTask(root1, root2, root2)
  ];
}

function buildVietaRoundCandidate(tasks, levelKey, roundLength, rng = Math.random) {
  if (levelKey === "level3") {
    return buildVietaPairRoundCandidate(tasks, roundLength, rng);
  }

  if (levelKey !== "level2") {
    return buildRoundFromPool(tasks, roundLength, rng);
  }

  const positiveAnswers = tasks.filter(function (task) {
    return task.answer > 0;
  });
  const negativeAnswers = tasks.filter(function (task) {
    return task.answer < 0;
  });

  if (positiveAnswers.length === 0 || negativeAnswers.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: Vieta Level 2 must include positive and negative answer tasks.`
    );
  }

  if (positiveAnswers.length + negativeAnswers.length !== tasks.length) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: Vieta Level 2 tasks must have non-zero integer answers.`
    );
  }

  return buildBalancedRound(
    tasks,
    roundLength,
    function (task) {
      return Math.sign(task.answer);
    },
    rng
  );
}

function buildVietaPairRoundCandidate(tasks, roundLength, rng = Math.random) {
  const ordinaryTasks = tasks.filter(function (task) {
    return task.pairType === "ordinary";
  });
  const doubleTasks = tasks.filter(function (task) {
    return task.pairType === "double";
  });

  if (ordinaryTasks.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 3\n\nExpected at least one ordinary root pair.`
    );
  }

  if (doubleTasks.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle} CONFIG ERROR\n\nTopic: Vieta’s Formulas\nLevel: Level 3\n\nExpected at least one double-root pair.`
    );
  }

  const doubleCount = getVietaDoubleRootQuota(roundLength);
  const ordinaryCount = roundLength - doubleCount;

  return [
    ...buildRoundFromPool(ordinaryTasks, ordinaryCount, rng),
    ...buildRoundFromPool(doubleTasks, doubleCount, rng)
  ];
}

function getVietaDoubleRootQuota(roundLength) {
  if (!Number.isInteger(roundLength) || roundLength < 1) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: Vieta round length must be a positive integer.`
    );
  }

  if (roundLength === 1) {
    return 0;
  }

  return Math.max(1, Math.round(roundLength / 6));
}

function arrangeVietaRoundQueue(tasks, levelKey, rng = Math.random) {
  const remainingTasks = [...tasks];
  const arrangedTasks = [];

  while (remainingTasks.length > 0) {
    let bestIndexes = [];
    let bestScore = Number.POSITIVE_INFINITY;

    remainingTasks.forEach(function (task, index) {
      const score = getVietaPlacementPenalty(arrangedTasks, task, levelKey);

      if (score < bestScore) {
        bestScore = score;
        bestIndexes = [index];
      } else if (score === bestScore) {
        bestIndexes.push(index);
      }
    });

    const selectedIndex = randomItem(bestIndexes, rng);
    arrangedTasks.push(remainingTasks.splice(selectedIndex, 1)[0]);
  }

  return arrangedTasks;
}

function getVietaQueuePenalty(tasks, levelKey) {
  return tasks.reduce(function (total, task, index) {
    return total + getVietaPlacementPenalty(
      tasks.slice(0, index),
      task,
      levelKey
    );
  }, 0);
}

function getVietaPlacementPenalty(previousTasks, task, levelKey) {
  const previousTask = previousTasks[previousTasks.length - 1];

  if (!previousTask) {
    return 0;
  }

  if (levelKey === "level3") {
    return getVietaPairPlacementPenalty(previousTasks, task);
  }

  const sameAnswer = task.answer === previousTask.answer;
  const sameKnownRoot = task.knownRoot === previousTask.knownRoot;
  const sameEquation = task.p === previousTask.p && task.q === previousTask.q;
  const sameAnswerSign =
    levelKey === "level2" &&
    Math.sign(task.answer) === Math.sign(previousTask.answer);
  const previousPreviousTask = previousTasks[previousTasks.length - 2];
  const thirdSameAnswerSign =
    levelKey === "level2" &&
    previousPreviousTask &&
    Math.sign(previousTask.answer) === Math.sign(previousPreviousTask.answer) &&
    Math.sign(previousPreviousTask.answer) === Math.sign(previousTask.answer) &&
    Math.sign(previousTask.answer) === Math.sign(task.answer);

  return (
    (sameEquation ? 10 : 0) +
    (sameAnswer ? 8 : 0) +
    (sameKnownRoot ? 5 : 0) +
    (sameAnswerSign ? 2 : 0) +
    (thirdSameAnswerSign ? 10 : 0)
  );
}

function getVietaPairPlacementPenalty(previousTasks, task) {
  const previousTask = previousTasks[previousTasks.length - 1];
  const sameEquation = task.p === previousTask.p && task.q === previousTask.q;
  const samePair = getVietaPairKey(task) === getVietaPairKey(previousTask);
  const samePairType = task.pairType === previousTask.pairType;
  const consecutiveDouble =
    task.pairType === "double" && previousTask.pairType === "double";

  return (
    (sameEquation ? 10 : 0) +
    (samePair ? 10 : 0) +
    (samePairType ? 4 : 0) +
    (consecutiveDouble ? 12 : 0)
  );
}

function getVietaPairKey(task) {
  return [task.root1, task.root2]
    .sort(function (a, b) {
      return a - b;
    })
    .join(":");
}

function generateVietaQuestion() {
  if (!vietaRoundQueue || vietaRoundQueue.length === 0) {
    prepareVietaRoundQueue();
  }

  const task = vietaRoundQueue.shift();

  if (!task) {
    currentQuestion = null;
    return;
  }

  if (selectedLevelKey === "level3") {
    currentQuestion = {
      type: "vieta",
      mode: "doubleRoot",
      equation: formatVietaEquation(task.p, task.q),
      root1: task.root1,
      root2: task.root2,
      answers: [task.root1, task.root2],
      pairType: task.pairType,
      p: task.p,
      q: task.q
    };
    return;
  }

  currentQuestion = {
    type: "vieta",
    mode: VIETA_LEVELS[selectedLevelKey].mode,
    equation: formatVietaEquation(task.p, task.q),
    knownRoot: task.knownRoot,
    answer: task.answer,
    root1: task.root1,
    root2: task.root2,
    p: task.p,
    q: task.q
  };
}

function prepareSquareIdentityRoundQueue() {
  const level =
    SQUARE_IDENTITY_LEVELS[selectedLevelKey] || SQUARE_IDENTITY_LEVELS.level1;
  validateSquareIdentityTasks(activeSquareIdentityTasks, level.mode);
  const getGroupKey = level.mode === "category"
    ? function (task) {
      return task.answerKind;
    }
    : function (task) {
      return task.correctIndex;
    };

  squareIdentityRoundQueue = buildBalancedRound(
    activeSquareIdentityTasks,
    QUESTIONS_PER_ROUND,
    getGroupKey,
    Math.random,
    getSquareIdentityNeighborPenalty
  )
    .map(function (task) {
      return {
        type: "squareIdentity",
        selectedChoiceValue: null,
        ...task
      };
    });
}

function getSquareIdentityNeighborPenalty(previousTask, task) {
  const sameSource = previousTask === task;
  const sameLeadingSquare =
    task.leadingSquare &&
    previousTask.leadingSquare &&
    task.leadingSquare === previousTask.leadingSquare;

  return (sameSource ? 16 : 0) + (sameLeadingSquare ? 1 : 0);
}

function buildBalancedRound(
  items,
  roundLength,
  getGroupKey,
  rng = Math.random,
  getNeighborPenalty = function () {
    return 0;
  }
) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: balanced round pool must contain at least one item.`
    );
  }

  if (!Number.isInteger(roundLength) || roundLength < 1) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: balanced round length must be a positive integer.`
    );
  }

  if (typeof getGroupKey !== "function" || typeof rng !== "function") {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: balanced round requires group and RNG functions.`
    );
  }

  const groups = new Map();

  items.forEach(function (item) {
    const groupKey = getGroupKey(item);

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }

    groups.get(groupKey).push(item);
  });

  const groupEntries = Array.from(groups.entries());
  const baseQuota = Math.floor(roundLength / groupEntries.length);
  const remainder = roundLength % groupEntries.length;
  const extraGroupKeys = new Set(
    shuffleArray(groupEntries, rng)
      .slice(0, remainder)
      .map(function ([groupKey]) {
        return groupKey;
      })
  );
  const selectedTasks = groupEntries.flatMap(function ([groupKey, groupItems]) {
    const quota = baseQuota + (extraGroupKeys.has(groupKey) ? 1 : 0);
    return buildRoundFromPool(groupItems, quota, rng);
  });

  return arrangeBalancedRoundTasks(
    selectedTasks,
    getGroupKey,
    rng,
    getNeighborPenalty
  );
}

function arrangeBalancedRoundTasks(tasks, getGroupKey, rng, getNeighborPenalty) {
  let bestTasks = [];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidateTasks = buildBalancedRoundArrangement(
      shuffleArray(tasks, rng),
      getGroupKey,
      rng,
      getNeighborPenalty
    );
    const candidateScore = countBalancedRoundNeighborPenalty(
      candidateTasks,
      getGroupKey,
      getNeighborPenalty
    );

    if (candidateScore < bestScore) {
      bestTasks = candidateTasks;
      bestScore = candidateScore;
    }

    if (bestScore === 0) {
      break;
    }
  }

  return bestTasks;
}

function buildBalancedRoundArrangement(tasks, getGroupKey, rng, getNeighborPenalty) {
  const remainingTasks = [...tasks];
  const arrangedTasks = [];

  while (remainingTasks.length > 0) {
    const previousTask = arrangedTasks[arrangedTasks.length - 1];
    let bestIndexes = [];
    let bestScore = Number.POSITIVE_INFINITY;

    remainingTasks.forEach(function (task, index) {
      const sameGroup =
        previousTask && getGroupKey(previousTask) === getGroupKey(task);
      const score = previousTask
        ? (sameGroup ? 8 : 0) + getNeighborPenalty(previousTask, task)
        : 0;

      if (score < bestScore) {
        bestScore = score;
        bestIndexes = [index];
      } else if (score === bestScore) {
        bestIndexes.push(index);
      }
    });

    const selectedIndex = randomItem(bestIndexes, rng);
    arrangedTasks.push(remainingTasks.splice(selectedIndex, 1)[0]);
  }

  return arrangedTasks;
}

function countBalancedRoundNeighborPenalty(tasks, getGroupKey, getNeighborPenalty) {
  return tasks.reduce(function (count, task, index) {
    if (index === 0) {
      return count;
    }

    const previousTask = tasks[index - 1];
    const sameGroup = getGroupKey(previousTask) === getGroupKey(task);

    return count + (sameGroup ? 8 : 0) + getNeighborPenalty(previousTask, task);
  }, 0);
}

function buildRoundFromPool(items, roundLength, rng = Math.random) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: round pool must contain at least one item.`
    );
  }

  if (!Number.isInteger(roundLength) || roundLength < 1) {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: round length must be a positive integer.`
    );
  }

  if (typeof rng !== "function") {
    throw new Error(
      `${PROJECT_CONFIG.browserTitle}: round RNG must be a function.`
    );
  }

  const round = [];

  while (round.length < roundLength) {
    const cycle = shuffleArray(items, rng);
    const previousItem = round[round.length - 1];

    if (cycle.length > 1 && cycle[0] === previousItem) {
      const alternateIndex = cycle.findIndex(function (item) {
        return item !== previousItem;
      });

      if (alternateIndex > 0) {
        [cycle[0], cycle[alternateIndex]] = [
          cycle[alternateIndex],
          cycle[0]
        ];
      }
    }

    const remainingSlots = roundLength - round.length;
    round.push(...cycle.slice(0, remainingSlots));
  }

  return round;
}

function shuffleArray(items, rng = Math.random) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function renderQuestion() {
  if (currentQuestion && currentQuestion.type === "proportion") {
    renderProportionQuestion();
    return;
  }

  if (currentQuestion && currentQuestion.type === "exponent") {
    renderExponentQuestion();
    return;
  }

  if (currentQuestion && currentQuestion.type === "squareIdentity") {
    renderSquareIdentityQuestion();
    return;
  }

  if (currentQuestion && currentQuestion.type === "squaresRoots") {
    renderSquaresRootsQuestion();
    return;
  }

  if (currentQuestion && currentQuestion.type === "vieta") {
    renderVietaQuestion();
    return;
  }

  renderTriangleQuestion();
}

function renderTriangleQuestion() {
  const { triple, unknownSide } = currentQuestion;
  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${(QUESTION_DURATION_MS / 1000).toFixed(1)}</div>
      </header>

      <div class="triangle-stage" aria-label="Right triangle question">
        <svg class="triangle-svg" viewBox="0 0 640 430" role="img" aria-label="Right triangle">
          <path class="triangle-line" d="M120 360 L520 360 L520 70 Z"></path>
        </svg>
        ${renderSide("a", triple, unknownSide)}
        ${renderSide("b", triple, unknownSide)}
        ${renderSide("c", triple, unknownSide)}
      </div>
    </section>
  `;

  const input = document.getElementById("answer-input");
  bindAnswerInput(input);

  focusAnswerInput();
}

function renderProportionQuestion() {
  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen proportion-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${(QUESTION_DURATION_MS / 1000).toFixed(1)}</div>
      </header>

      <div class="proportion-board" aria-label="Proportion question">
        <div class="fraction">
          <div class="fraction-top">${renderProportionPart("a")}</div>
          <div class="fraction-line"></div>
          <div class="fraction-bottom">${renderProportionPart("b")}</div>
        </div>
        <div class="equals-sign">=</div>
        <div class="fraction">
          <div class="fraction-top">${renderProportionPart("c")}</div>
          <div class="fraction-line"></div>
          <div class="fraction-bottom">${renderProportionPart("d")}</div>
        </div>
      </div>
    </section>
  `;

  const input = document.querySelector(".answer-input");
  bindAnswerInput(input);
  bindSignToggleControl();

  focusAnswerInput();
}

function renderExponentQuestion() {
  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen exponent-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${(QUESTION_DURATION_MS / 1000).toFixed(1)}</div>
      </header>

      <div class="exponent-board" aria-label="Exponent question">
        ${renderExponentTaskBody()}
      </div>
    </section>
  `;

  const input = document.querySelector(".answer-input");
  const allowSigned = isSignedAnswerMode();
  input.inputMode = "numeric";
  input.pattern = allowSigned ? "-?[0-9]*" : "[0-9]*";
  input.autocomplete = "off";
  bindAnswerInput(input);
  bindSignToggleControl();

  focusAnswerInput();
}

function bindAnswerInput(input) {
  if (!input) {
    return;
  }

  input.addEventListener("input", function () {
    checkAnswer({ onlyIfCorrect: true });
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer({ allowWrong: true });
    }
  });
}

function bindSignToggleControl() {
  const input = document.querySelector(".answer-input");
  const signButton = document.querySelector(".answer-sign-toggle");

  if (!input || !signButton) {
    return;
  }

  signButton.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    toggleAnswerSign(input);
  });

  signButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAnswerSign(input);
    }
  });
}

function renderSquareIdentityQuestion() {
  const activeLevel = getActiveLevelConfig();
  const levelPolicy =
    SQUARE_IDENTITY_LEVELS[selectedLevelKey] || SQUARE_IDENTITY_LEVELS.level1;
  const choices = getSquareIdentityChoices(levelPolicy);

  app.innerHTML = `
    <section class="game-screen square-identities-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${getInitialTimerText()}</div>
      </header>

      <div class="square-identities-board" aria-label="Square identity question">
        <div class="square-identities-expression">
          ${currentQuestion.expression}
        </div>

        <div class="square-identities-choices">
          ${choices.map(function (choice) {
            const productClass = choice.isProduct ? " is-product-choice" : "";
            return `
              <button
                class="square-identity-choice${productClass}"
                type="button"
                data-value="${choice.value}"
              >
                ${renderSquareIdentityChoiceContent(choice)}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll(".square-identity-choice").forEach(function (button) {
    button.addEventListener("click", function () {
      handleSquareIdentityChoice(button);
    });
  });
}

function renderSquaresRootsQuestion() {
  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen squares-roots-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${(QUESTION_DURATION_MS / 1000).toFixed(1)}</div>
      </header>

      <div class="squares-roots-board" aria-label="Squares and roots question">
        <div class="squares-roots-expression">
          <span>${currentQuestion.expression}</span>
          <span class="squares-roots-equals">=</span>
          <input
            id="answer-input"
            class="answer-input squares-roots-answer-input"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="off"
            aria-label="Squares and roots answer"
          >
        </div>
      </div>
    </section>
  `;

  const input = document.querySelector(".answer-input");

  if (input) {
    input.inputMode = "numeric";
    input.pattern = "[0-9]*";
    input.autocomplete = "off";
    bindAnswerInput(input);
  }

  focusAnswerInput();
}

function renderVietaQuestion() {
  if (currentQuestion && currentQuestion.mode === "doubleRoot") {
    renderVietaPairQuestion();
    return;
  }

  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen vieta-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${getInitialTimerText()}</div>
      </header>

      <div class="vieta-board" aria-label="Vieta's formulas question">
        <div class="vieta-equation">
          ${currentQuestion.equation}
        </div>

        <div class="vieta-roots-block">
          <div class="vieta-known-root">
            x₁ = ${currentQuestion.knownRoot}
          </div>

          <div class="vieta-answer-row">
            <span class="vieta-root-label">x₂ =</span>
            ${renderVietaAnswerInput()}
          </div>
        </div>
      </div>
    </section>
  `;

  const input = document.querySelector(".answer-input");

  if (input) {
    input.inputMode = "numeric";
    input.pattern = selectedLevelKey === "level2" ? "-?[0-9]*" : "[0-9]*";
    input.autocomplete = "off";
    bindAnswerInput(input);
  }

  bindSignToggleControl();
  focusAnswerInput();
}

function renderVietaPairQuestion() {
  const activeLevel = getActiveLevelConfig();

  app.innerHTML = `
    <section class="game-screen vieta-game-screen">
      <header class="game-top">
        <div id="level">${activeLevel.title} / ${activeLevel.label}</div>
        <div id="score">${correctCount}:${wrongCount}</div>
        <div id="time">Time: ${getInitialTimerText()}</div>
      </header>

      <div class="vieta-board" aria-label="Vieta's formulas question">
        <div class="vieta-equation">
          ${currentQuestion.equation}
        </div>

        <div class="vieta-roots-block vieta-pair-roots-block">
          ${renderVietaPairInput("x₁", "vieta-root-1")}
          ${renderVietaPairInput("x₂", "vieta-root-2")}
        </div>
      </div>
    </section>
  `;

  bindVietaPairInputs();
  scheduleVietaPairFocus();
}

function renderVietaPairInput(label, inputId) {
  return `
    <div class="vieta-answer-row vieta-pair-answer-row">
      <label class="vieta-root-label" for="${inputId}">${label} =</label>
      <input
        id="${inputId}"
        class="answer-input vieta-answer-input vieta-pair-input"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="off"
        aria-label="${label} Vieta root"
      >
    </div>
  `;
}

function bindVietaPairInputs() {
  document.querySelectorAll(".vieta-pair-input").forEach(function (input) {
    input.inputMode = "numeric";
    input.pattern = "[0-9]*";
    input.autocomplete = "off";

    input.addEventListener("input", function () {
      checkVietaPairAnswer({ onlyIfCorrect: true });
    });

    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") {
        return;
      }

      const firstInput = document.getElementById("vieta-root-1");
      const secondInput = document.getElementById("vieta-root-2");

      if (
        input === firstInput &&
        secondInput &&
        !isFilledVietaPairValue(secondInput.value)
      ) {
        event.preventDefault();
        secondInput.focus({ preventScroll: true });
        secondInput.select();
        return;
      }

      checkVietaPairAnswer({ allowWrong: true });
    });
  });
}

function checkVietaPairAnswer(options) {
  const settings = options || {};
  const onlyIfCorrect = Boolean(settings.onlyIfCorrect);
  const allowWrong = settings.allowWrong !== false;

  if (isChecking || !currentQuestion || isQuestionResolved) {
    return;
  }

  const firstInput = document.getElementById("vieta-root-1");
  const secondInput = document.getElementById("vieta-root-2");

  if (!firstInput || !secondInput) {
    return;
  }

  const firstValue = firstInput.value.trim();
  const secondValue = secondInput.value.trim();

  if (
    !isFilledVietaPairValue(firstValue) ||
    !isFilledVietaPairValue(secondValue)
  ) {
    return;
  }

  const userRoot1 = Number(firstValue);
  const userRoot2 = Number(secondValue);

  if (!Number.isFinite(userRoot1) || !Number.isFinite(userRoot2)) {
    if (!onlyIfCorrect && allowWrong) {
      resolveVietaPairQuestion("wrong");
    }
    return;
  }

  const directMatch =
    userRoot1 === currentQuestion.root1 &&
    userRoot2 === currentQuestion.root2;
  const reverseMatch =
    userRoot1 === currentQuestion.root2 &&
    userRoot2 === currentQuestion.root1;

  if (directMatch || reverseMatch) {
    resolveVietaPairQuestion("correct");
    return;
  }

  if (!onlyIfCorrect && allowWrong) {
    resolveVietaPairQuestion("wrong");
  }
}

function isFilledVietaPairValue(value) {
  const normalizedValue = value.trim();

  return normalizedValue !== "" && normalizedValue !== "-";
}

function resolveVietaPairQuestion(outcome) {
  resolveQuestion(outcome);
}

function scheduleVietaPairFocus() {
  requestAnimationFrame(function () {
    focusVietaPairInput();

    if (isMobileViewport()) {
      scheduleTrackedFocus(focusVietaPairInput, 80);
      scheduleTrackedFocus(focusVietaPairInput, 180);
    }
  });
}

function focusVietaPairInput() {
  const input = document.getElementById("vieta-root-1");

  if (!input) {
    return;
  }

  input.focus({ preventScroll: true });
  input.select();
}

function applyVietaPairFeedback(outcome) {
  document.querySelectorAll(".vieta-pair-input").forEach(function (input) {
    input.classList.add(outcome === "correct" ? "correct" : "wrong");
  });
}

function getSquareIdentityChoices(activeLevel) {
  if (activeLevel.mode === "category") {
    return [
      {
        formula: "a² − b²",
        name: "Difference of Squares",
        value: "differenceSquares"
      },
      {
        formula: "(a − b)²",
        name: "Square of a Difference",
        value: "squareDifference"
      },
      {
        formula: "(a + b)²",
        name: "Square of a Sum",
        value: "squareSum"
      }
    ];
  }

  return currentQuestion.choices.map(function (label, index) {
    return {
      label,
      value: String(index),
      isProduct: label.includes(")(")
    };
  });
}

function renderSquareIdentityChoiceContent(choice) {
  if (choice.formula && choice.name) {
    return `
      <span class="square-identity-choice-formula">${choice.formula}</span>
      <span class="square-identity-choice-name">${choice.name}</span>
    `;
  }

  if (choice.isProduct) {
    return renderSquareIdentityProductChoice(choice.label);
  }

  return `<span class="square-identity-choice-formula">${choice.label}</span>`;
}

function renderSquareIdentityProductChoice(label) {
  const factors = label.split(")(");

  if (factors.length !== 2) {
    return `<span class="square-identity-choice-formula">${label}</span>`;
  }

  return `
    <span class="square-identity-choice-formula square-identity-product-formula">
      <span class="choice-product-factor">${factors[0]})</span>
      <span class="choice-product-factor">(${factors[1]}</span>
    </span>
  `;
}

function handleSquareIdentityChoice(button) {
  if (isChecking || isQuestionResolved || !button) {
    return;
  }

  const rawValue = button.dataset.value;
  const isCorrect = rawValue === getSquareIdentityCorrectValue();

  currentQuestion.selectedChoiceValue = rawValue;
  resolveQuestion(isCorrect ? "correct" : "wrong");
}

function getSquareIdentityCorrectValue() {
  const activeLevel =
    SQUARE_IDENTITY_LEVELS[selectedLevelKey] || SQUARE_IDENTITY_LEVELS.level1;

  if (activeLevel.mode === "category") {
    return currentQuestion.answerKind;
  }

  return String(currentQuestion.correctIndex);
}

function applySquareIdentityFeedback(outcome) {
  const buttons = Array.from(document.querySelectorAll(".square-identity-choice"));

  if (buttons.length === 0) {
    return;
  }

  const correctValue = getSquareIdentityCorrectValue();

  buttons.forEach(function (button) {
    const value = button.dataset.value;
    button.disabled = true;

    if (value === currentQuestion.selectedChoiceValue && outcome !== "correct") {
      button.classList.add("is-wrong");
    }

    if (value === correctValue) {
      button.classList.add("is-correct");
    }
  });
}

function renderExponentTaskBody() {
  if (currentQuestion.kind === "reducedExponent") {
    return `
      <div class="exponent-expression">
        <span>${currentQuestion.left}</span>
        <span class="exponent-equals">=</span>
        <span class="exponent-power-answer">
          <span>10</span>${renderExponentInput("exponent-power-input")}
        </span>
      </div>
    `;
  }

  if (currentQuestion.kind === "mixedInput") {
    return `
      <div class="exponent-expression">
        <span>${currentQuestion.beforeInput}</span>
        ${renderExponentInput()}
        <span>${currentQuestion.afterInput}</span>
      </div>
    `;
  }

  return `
    <div class="exponent-expression">
      <span>${currentQuestion.expression}</span>
      <span class="exponent-equals">=</span>
      ${renderExponentInput()}
    </div>
  `;
}

function renderExponentInput(extraClass = "") {
  const className = `answer-input exponent-answer-input ${extraClass}`.trim();
  const inputHtml = `
    <input
      id="answer-input"
      class="${className}"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      aria-label="Exponent answer"
    >
  `;

  if (!isSignedAnswerMode()) {
    return inputHtml;
  }

  return `
    <div class="signed-answer-control exponent-signed-answer-control">
      ${inputHtml}
      ${renderSignToggleButton()}
    </div>
  `;
}

function renderVietaAnswerInput() {
  const inputHtml = `
    <input
      id="answer-input"
      class="answer-input vieta-answer-input"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      aria-label="Unknown Vieta root"
    >
  `;

  if (selectedLevelKey !== "level2") {
    return inputHtml;
  }

  return `
    <div class="signed-answer-control vieta-signed-answer-control">
      ${inputHtml}
      ${renderSignToggleButton()}
    </div>
  `;
}

function renderProportionPart(key) {
  const value = currentQuestion[key];

  if (value === null) {
    return renderProportionAnswerInput(key);
  }

  return `<span class="proportion-number">${value}</span>`;
}

function renderProportionAnswerInput(key) {
  const pattern = isSignedAnswerMode() ? "-?[0-9]*" : "[0-9]*";
  const inputHtml = `
    <input
      id="answer-input"
      class="answer-input proportion-answer-input"
      type="text"
      inputmode="numeric"
      pattern="${pattern}"
      autocomplete="off"
      aria-label="Unknown proportion value ${key}"
    >
  `;

  if (!isSignedAnswerMode()) {
    return inputHtml;
  }

  return `
    <div class="signed-answer-control proportion-signed-answer-control">
      ${inputHtml}
      ${renderSignToggleButton()}
    </div>
  `;
}

function isSignedAnswerMode() {
  if (
    selectedTopicKey === "vieta" &&
    selectedLevelKey === "level2"
  ) {
    return true;
  }

  if (
    selectedTopicKey === "proportions" &&
    selectedLevelKey === "level3"
  ) {
    return true;
  }

  if (
    selectedTopicKey === "exponents" &&
    (
      selectedLevelKey === "level2" ||
      selectedLevelKey === "level3"
    )
  ) {
    return true;
  }

  return false;
}

function renderSignToggleButton() {
  if (!isSignedAnswerMode()) {
    return "";
  }

  return `
    <button
      class="answer-sign-toggle"
      type="button"
      aria-label="Change answer sign"
      title="Change sign"
    >
      ±
    </button>
  `;
}

function renderSide(side, triple, unknownSide) {
  const className = `side-label side-label-${side}`;

  if (side === unknownSide) {
    return `
      <label class="${className}">
        <input
          id="answer-input"
          class="answer-input"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="off"
          aria-label="Unknown side ${side}"
        >
      </label>
    `;
  }

  return `<div class="${className}">${side}: ${triple[side]}</div>`;
}

function startQuestionTimer() {
  clearQuestionTimer();
  lastBeepSecond = null;
  const durationMs = getQuestionDurationMs();
  questionDeadline = Date.now() + durationMs;

  questionTimer = setInterval(function () {
    const timeLeftMs = Math.max(0, questionDeadline - Date.now());
    const remainingSeconds = Math.ceil(timeLeftMs / 1000);
    const timeElement = document.getElementById("time");

    if (timeElement) {
      timeElement.textContent = `Time: ${(timeLeftMs / 1000).toFixed(1)}`;
    }

    if (remainingSeconds !== lastBeepSecond && remainingSeconds > 0) {
      lastBeepSecond = remainingSeconds;
      playBeep(
        TIMER_BEEP_FREQUENCY,
        TIMER_BEEP_DURATION_MS,
        TIMER_BEEP_VOLUME
      );
    }

    if (timeLeftMs <= 0) {
      resolveQuestion("timeout");
    }
  }, TIMER_UPDATE_MS);
}

function getQuestionDurationMs() {
  if (
    selectedTopicKey === "vieta" &&
    selectedLevelKey === "level3"
  ) {
    return 15000;
  }

  if (
    selectedTopicKey === "vieta" &&
    (
      selectedLevelKey === "level1" ||
      selectedLevelKey === "level2"
    )
  ) {
    return 10000;
  }

  if (
    selectedTopicKey === "squareIdentities" &&
    selectedLevelKey === "level3"
  ) {
    return 9000;
  }

  return QUESTION_DURATION_MS;
}

function getInitialTimerText() {
  return (getQuestionDurationMs() / 1000).toFixed(1);
}

function checkAnswer(options) {
  const settings = options || {};
  const onlyIfCorrect = Boolean(settings.onlyIfCorrect);
  const allowWrong = settings.allowWrong !== false;

  if (isChecking || !currentQuestion || isQuestionResolved) {
    return;
  }

  const input = document.querySelector(".answer-input");
  if (!input) {
    return;
  }

  const rawAnswer = input.value.trim();
  if (rawAnswer === "" || rawAnswer === "-") {
    if (!onlyIfCorrect && allowWrong) {
      resolveQuestion("wrong");
    }
    return;
  }

  const answer = Number(rawAnswer);
  if (!Number.isFinite(answer)) {
    if (!onlyIfCorrect && allowWrong) {
      resolveQuestion("wrong");
    }
    return;
  }

  if (answer === currentQuestion.answer) {
    resolveQuestion("correct");
    return;
  }

  if (!onlyIfCorrect && allowWrong) {
    resolveQuestion("wrong");
  }
}

function toggleAnswerSign(input) {
  if (!input || isQuestionResolved) {
    return;
  }

  const currentValue = input.value.trim();

  if (currentValue.startsWith("-")) {
    input.value = currentValue.slice(1);
  } else {
    input.value = `-${currentValue}`;
  }

  input.focus({ preventScroll: true });

  const cursorPosition = input.value.length;

  if (typeof input.setSelectionRange === "function") {
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function disableAnswerControls() {
  const inputs = document.querySelectorAll(".answer-input");
  const signButtons = document.querySelectorAll(".answer-sign-toggle");

  inputs.forEach(function (input) {
    input.disabled = true;
  });

  signButtons.forEach(function (signButton) {
    signButton.disabled = true;
  });
}

function resolveQuestion(outcome) {
  if (isQuestionResolved) {
    return;
  }

  isQuestionResolved = true;
  isChecking = true;
  clearQuestionTimer();

  const input = document.querySelector(".answer-input");
  let delayMs = FEEDBACK_DURATION_MS;

  disableAnswerControls();

  if (currentQuestion && currentQuestion.type === "squareIdentity") {
    applySquareIdentityFeedback(outcome);
  }

  if (
    currentQuestion &&
    currentQuestion.type === "vieta" &&
    currentQuestion.mode === "doubleRoot"
  ) {
    applyVietaPairFeedback(outcome);
  }

  if (outcome === "correct") {
    correctCount += 1;
    score = correctCount;
    if (input && currentQuestion.mode !== "doubleRoot") {
      input.classList.add("correct");
    }
    playNextSequence();
    delayMs = canPlaySound()
      ? Math.max(FEEDBACK_DURATION_MS, getNextSequenceDurationMs())
      : FEEDBACK_DURATION_MS;
  } else {
    wrongCount += 1;
    if (input && (!currentQuestion || currentQuestion.mode !== "doubleRoot")) {
      input.classList.add("wrong");
    }
    playErrorQuack();
    delayMs = canPlaySound()
      ? Math.max(FEEDBACK_DURATION_MS, ERROR_QUACK_DURATION_MS)
      : FEEDBACK_DURATION_MS;
  }

  updateScoreDisplay();
  questionCount += 1;
  scheduleNextStep(delayMs);
}

function scheduleNextStep(delayMs) {
  clearNextStepTimeout();
  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    if (nextStepTimeout === timeoutId) {
      nextStepTimeout = null;
    }

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    if (questionCount >= QUESTIONS_PER_ROUND) {
      showRoundResult();
      return;
    }

    nextQuestion();
  }, delayMs);

  nextStepTimeout = timeoutId;
}

function nextQuestion() {
  clearQuestionTimer();
  clearNextStepTimeout();
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = true;
  isQuestionResolved = false;

  generateQuestion();
  renderQuestion();
  scheduleAnswerInputFocus();
  isChecking = false;
  startQuestionTimer();
}

function showRoundResult() {
  setCurrentScreen("result", "levelSelect");
  clearQuestionTimer();
  clearNextStepTimeout();
  clearFocusTimeouts();
  currentQuestion = null;
  questionDeadline = null;
  lastBeepSecond = null;
  isChecking = true;
  isQuestionResolved = true;

  const isPerfectWin =
    correctCount === QUESTIONS_PER_ROUND && wrongCount === 0;
  const activeLevel = getActiveLevelConfig();
  emitDMathEvent("round-completed", {
    topicKey: selectedTopicKey,
    levelKey: selectedLevelKey
  });
  const winnerLines = getWinnerLines();
  const titleMarkup = isPerfectWin
    ? `
      <div class="winner-title">
        ${winnerLines.map(function (line) {
          return `<div>${line}</div>`;
        }).join("")}
      </div>
    `
    : `<h1 class="result-title">Round Result</h1>`;

  app.innerHTML = `
    <section class="result-screen">
      <div class="result-meta">${activeLevel.title} / ${activeLevel.label}</div>
      ${titleMarkup}
      <div class="result-score">${correctCount}:${wrongCount}</div>
      <div class="result-buttons">
        <button id="restart-round" class="result-button" type="button">
          to be continued
        </button>
        <button id="erase-round" class="result-button" type="button">
          erase
        </button>
      </div>
    </section>
  `;

  if (isPerfectWin) {
    playWinFanfare();
  }

  document
    .getElementById("restart-round")
    .addEventListener("click", restartSameLevel);
  document
    .getElementById("erase-round")
    .addEventListener("click", eraseToLevelSelect);
}

function restartSameLevel() {
  startGame();
}

function getWinnerLines() {
  if (selectedLevelKey === "level2") {
    return ["Broken", "IMBA!"];
  }

  if (selectedLevelKey === "level3") {
    return ["I salute you,", "GENERAL!"];
  }

  return ["You're", "TIGER!"];
}

function eraseToLevelSelect() {
  resetRoundState();
  selectedLevelKey = null;
  activeTriples = [];
  activeProportions = [];
  activeExponentTasks = [];
  activeSquareIdentityTasks = [];
  activeSquaresRootsTasks = [];
  activeVietaTasks = [];
  vietaRoundQueue = [];
  showLevelSelect();
}

function randomItem(items, rng = Math.random) {
  return items[Math.floor(rng() * items.length)];
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent = `${correctCount}:${wrongCount}`;
  }
}

function focusAnswerInput() {
  const input = document.querySelector(".answer-input");

  if (!input) {
    return;
  }

  input.focus({ preventScroll: true });
  input.select();
}

function scheduleAnswerInputFocus() {
  requestAnimationFrame(function () {
    focusAnswerInput();

    if (isMobileViewport()) {
      scheduleTrackedFocus(focusAnswerInput, 80);
      scheduleTrackedFocus(focusAnswerInput, 180);
    }
  });
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function scheduleTrackedFocus(callback, delay = 0) {
  const generationAtSchedule = screenGeneration;
  const timeoutId = window.setTimeout(function () {
    focusTimeoutIds.delete(timeoutId);

    if (generationAtSchedule !== screenGeneration) {
      return;
    }

    callback();
  }, delay);

  focusTimeoutIds.add(timeoutId);

  return timeoutId;
}

function clearFocusTimeouts() {
  focusTimeoutIds.forEach(function (timeoutId) {
    clearTimeout(timeoutId);
  });

  focusTimeoutIds.clear();
}

function clearQuestionTimer() {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}

function clearIntroTimeout() {
  if (introTimeout !== null) {
    clearTimeout(introTimeout);
    introTimeout = null;
  }
}

function clearNextStepTimeout() {
  if (nextStepTimeout) {
    clearTimeout(nextStepTimeout);
    nextStepTimeout = null;
  }
}

function clearLevelPreviewTimeout() {
  if (levelPreviewTimeout) {
    clearTimeout(levelPreviewTimeout);
    levelPreviewTimeout = null;
  }
}

function scheduleTrackedSound(callback, delay) {
  const timeoutId = window.setTimeout(function () {
    soundTimeoutIds.delete(timeoutId);
    callback();
  }, delay);

  soundTimeoutIds.add(timeoutId);

  return timeoutId;
}

function clearSoundTimeouts() {
  soundTimeoutIds.forEach(function (timeoutId) {
    clearTimeout(timeoutId);
  });

  soundTimeoutIds.clear();
}

function cancelActiveScreenActivity({ clearSounds = true } = {}) {
  clearQuestionTimer();
  clearNextStepTimeout();
  clearLevelPreviewTimeout();
  clearIntroTimeout();
  clearFocusTimeouts();

  if (clearSounds) {
    clearSoundTimeouts();
  }

  const activeElement = document.activeElement;

  if (activeElement && typeof activeElement.blur === "function") {
    activeElement.blur();
  }

  questionDeadline = null;
  lastBeepSecond = null;
}

function clearActiveQuestionQueues() {
  triangleRoundQueue = [];
  proportionRoundQueue = [];
  exponentRoundQueue = [];
  squareIdentityRoundQueue = [];
  squaresRootsRoundQueue = [];
  vietaRoundQueue = [];
}

function abortRound() {
  cancelActiveScreenActivity();

  score = 0;
  correctCount = 0;
  wrongCount = 0;
  questionCount = 0;
  currentQuestion = null;
  isChecking = false;
  isQuestionResolved = true;
  clearActiveQuestionQueues();
}

function navigateToBackTarget(backTarget) {
  if (backTarget === "branchSelect") {
    selectedBranchKey = null;
    selectedTopicKey = null;
    selectedLevelKey = null;
    showBranchSelect();
    return;
  }

  if (backTarget === "topicSelect") {
    selectedTopicKey = null;
    selectedLevelKey = null;
    showTopicSelect();
    return;
  }

  if (backTarget === "levelSelect") {
    selectedLevelKey = null;
    showLevelSelect();
  }
}

function handleGlobalBack() {
  if (!currentBackTarget) {
    return;
  }

  const backTarget = currentBackTarget;

  if (currentScreenKey === "game" || currentScreenKey === "result") {
    abortRound();
  } else {
    cancelActiveScreenActivity();
  }

  navigateToBackTarget(backTarget);
}

async function unlockAudio() {
  if (!SOUND_ENABLED) {
    return;
  }

  const AudioConstructor = window.AudioContext || window.webkitAudioContext;

  if (!AudioConstructor) {
    return;
  }

  if (audioUnlocked && audioContext && audioContext.state === "running") {
    return;
  }

  try {
    if (!audioContext) {
      audioContext = new AudioConstructor();
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.03);

    audioUnlocked = true;
    console.log("Audio state:", audioContext.state, "unlocked:", audioUnlocked);
  } catch (error) {
    console.warn("Audio unlock failed:", error);
    audioUnlocked = false;
  }
}

function playBeep(frequency, durationMs, volume) {
  if (!canPlaySound()) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + durationMs / 1000
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + durationMs / 1000);
}

function playNextSequence() {
  if (!canPlaySound()) {
    return;
  }

  for (let i = 0; i < NEXT_BEEP_COUNT; i++) {
    scheduleTrackedSound(function () {
      playBeep(
        NEXT_BEEP_FREQUENCY,
        NEXT_BEEP_DURATION_MS,
        NEXT_BEEP_VOLUME
      );
    }, i * NEXT_BEEP_GAP_MS);
  }
}

function playErrorQuack() {
  if (!canPlaySound()) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(ERROR_QUACK_START_FREQUENCY, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    ERROR_QUACK_END_FREQUENCY,
    now + ERROR_QUACK_DURATION_MS / 1000
  );

  gain.gain.setValueAtTime(ERROR_QUACK_VOLUME, now);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + ERROR_QUACK_DURATION_MS / 1000
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + ERROR_QUACK_DURATION_MS / 1000);
}

function playWinFanfare() {
  if (!canPlaySound()) {
    return;
  }

  WIN_FANFARE_NOTES.forEach(function (frequency, index) {
    scheduleTrackedSound(function () {
      playBeep(frequency, WIN_FANFARE_NOTE_MS, WIN_FANFARE_VOLUME);
    }, index * (WIN_FANFARE_NOTE_MS + WIN_FANFARE_GAP_MS));
  });
}

function getNextSequenceDurationMs() {
  return (NEXT_BEEP_COUNT - 1) * NEXT_BEEP_GAP_MS + NEXT_BEEP_DURATION_MS;
}

function canPlaySound() {
  return SOUND_ENABLED && audioUnlocked && Boolean(audioContext);
}

function setupAudioUnlockListeners() {
  const unlockOnce = async function () {
    await unlockAudio();
    document.removeEventListener("pointerdown", unlockOnce);
    document.removeEventListener("touchstart", unlockOnce);
    document.removeEventListener("click", unlockOnce);
  };

  document.addEventListener("pointerdown", unlockOnce, { once: true });
  document.addEventListener("touchstart", unlockOnce, { once: true });
  document.addEventListener("click", unlockOnce, { once: true });
}
