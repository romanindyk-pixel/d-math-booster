# D_MATH BOOSTER

D_MATH BOOSTER is a customizable, browser-based math practice game for teachers, parents, and students.

It is a small static project made to play, copy, and customize. It uses plain HTML, CSS, and vanilla JavaScript: no framework, Node.js, npm, or build step is required to run it.

## Live Demo

Try [D_MATH BOOSTER](https://d-math-booster.netlify.app).

## Privacy

The open-source template contains no analytics or tracking. The official D_MATH BOOSTER demo uses privacy-conscious anonymous usage analytics during the pilot to understand which features are useful. No student accounts, answer histories, scores, or personal information are collected by the game analytics.

## What it is

The game presents short, timed math rounds with immediate feedback, score tracking, audio cues, Back navigation, and desktop and mobile layouts. Keyboard input is supported. Sound effects are synthesized in the browser with the Web Audio API, so no audio files are required.

## Included topics

### Algebra

- Proportions
- Exponents
- Square Identities
- Squares / Roots
- Vieta’s Formulas

### Geometry

- Triangles

Each included topic currently has three supported levels. You can rename the display titles and labels of those levels in the content configuration.

## Features

- 12-question practice rounds
- Timed questions with instant correct-answer feedback
- Wrong-answer and timeout feedback
- Desktop and mobile-friendly layouts
- Editable exercises and text through `content.js`
- No backend, accounts, or analytics code in the project

## Quick start

1. Download or copy the project files.
2. Keep the four runtime files together: `index.html`, `style.css`, `content.js`, and `game.js`.
3. Open `index.html` in a modern browser.
4. Play the game.
5. Edit `content.js` to customize included exercises and text.
6. Reload the page to see your changes.

The project is designed as a plain static site. It can be opened directly in a browser or served from any static host; browser security policies can vary by environment.

## Customize

For most content customization, edit `content.js`.

You can change:

- Branding and splash text
- Branch and topic display information
- The order of existing supported topics
- Intro text
- Existing level titles and labels
- Exercise pools for the included topics

See [CUSTOMIZE.md](CUSTOMIZE.md) for the supported content schemas and safe editing workflow.

## Project files

| File | Purpose |
| --- | --- |
| `content.js` | Exercises and editable project/content metadata. This is the main file for teachers and parents. |
| `game.js` | Game mechanics, validation, rendering, timers, input, audio, and navigation. Most users do not need to edit it. |
| `style.css` | Visual appearance and responsive styling. |
| `index.html` | Static page shell and script loading. |

## Configuration safety

D_MATH BOOSTER validates supported configuration data when the page loads. If an exercise does not match a supported format, the game displays a `CONFIG ERROR` and identifies the configuration item that needs attention.

This validation cannot repair invalid JavaScript syntax. A missing comma, quote, or bracket in `content.js` can prevent that file from loading before the validator runs. In that case, check the browser console for the syntax error first.

## Current limitations

- The engine currently supports the six included topics.
- Each supported topic currently uses three engine-supported levels.
- Adding a new topic requires changes to `game.js`.
- Adding Level 4 requires engine support.
- New renderers, input modes, or task kinds require engine changes.

## Hosting

Because D_MATH BOOSTER is a static site, it can be hosted on services such as Netlify or GitHub Pages.

The game itself has no backend or runtime API dependency. Its pixel font is loaded from Google Fonts, with local fallback fonts if the font is unavailable.

Once the repository is published as a GitHub Template Repository, you can use GitHub's "Use this template" button to create your own copy.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for engine boundaries and regression requirements.

## License

D_MATH BOOSTER is available under the [MIT License](LICENSE).
