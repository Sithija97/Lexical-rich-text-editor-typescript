# Lexical Example

A React + TypeScript rich text editor built on top of [Meta's Lexical framework](https://lexical.dev), with a fully custom toolbar, dark mode, and several playground-style features wired up on top of the base editor.

## Features

- Bold, italic, underline, strikethrough, and inline code formatting
- Font family, font size, text color, and background color pickers
- Block formatting: headings, quotes, code blocks, bulleted/numbered/check lists
- Text alignment and indentation
- Hyperlinks with a floating link editor
- An **Insert** menu for horizontal rules, page breaks, images, inline images, tables, and polls
- Undo, redo, and clear actions
- Light/dark theme toggle (top-right of the header), persisted across sessions and respecting the OS preference on first load
- HTML and Markdown export (via Lexical's `@lexical/html` / `@lexical/markdown` packages)

Not yet wired up (present in the codebase as parked/future work — see [Project Journey](#project-journey)): multi-column layouts and Excalidraw drawings. Both have partial scaffolding under `src/plugins` and `src/nodes` but are missing pieces (layout node classes, and the `@excalidraw/excalidraw` dependency, respectively).

## Tech Stack

| Layer            | Choice                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Editor framework | [Lexical](https://lexical.dev) (`lexical`, `@lexical/react`, `@lexical/table`, and related packages) |
| UI               | React 19                                                                                             |
| Language         | TypeScript                                                                                           |
| Build tool       | Vite                                                                                                 |
| Linting          | ESLint (flat config) + `typescript-eslint`                                                           |
| Formatting       | Prettier                                                                                             |
| Package manager  | npm                                                                                                  |

## Project Structure

```
src/
  Editor.tsx           # LexicalComposer setup: nodes, plugins, theme
  App.tsx              # App shell: header + editor
  components/          # Header, theme toggle, logo
  hooks/                # useTheme, useModal
  themes/               # Lexical editor theme (CSS class mapping)
  plugins/              # Toolbar, links, images, tables, polls, page breaks, ...
  nodes/                # Custom Lexical nodes (images, polls, page breaks, ...)
  ui/                   # Shared UI primitives (Button, Dialog, DropDown, ColorPicker, ...)
  shared/               # Vendored copy of Lexical's internal shared utilities
```

## Getting Started

Requires Node.js 18+ and npm.

```bash
npm install       # install dependencies
npm run dev       # start the Vite dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
```

### Scripts

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot module reload         |
| `npm run build`        | Type-check (`tsc`) and build the production bundle  |
| `npm run preview`      | Serve the built `dist/` output locally              |
| `npm run typecheck`    | Run the TypeScript compiler without emitting output |
| `npm run lint`         | Run ESLint over the project                         |
| `npm run format`       | Format the project with Prettier                    |
| `npm run format:check` | Check formatting without writing changes            |

## Project Journey

This started as a fairly standard Lexical + React + TypeScript starter and has been incrementally pushed forward, upgrade by upgrade:

| Stage            | Lexical   | Notes                                                                                                                                                                                                 |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial setup    | `v0.9.2`  | Base rich text editor: formatting, lists, links                                                                                                                                                       |
| Table support    | `v0.14.2` | Added `@lexical/table`                                                                                                                                                                                |
| First major bump | `v0.16.0` |                                                                                                                                                                                                       |
| Refactor pass    | `v0.40.0` | Migrated off removed grid-selection APIs (`DEPRECATED_$isGridSelection` → `$isRangeSelection`), consolidated selection types under `BaseSelection`, switched `LexicalErrorBoundary` to a named import |
| Current          | `v0.48.0` | This pass — see below                                                                                                                                                                                 |

**This pass** additionally:

- Upgraded React `18 → 19`, Vite `4 → 8`, and TypeScript to the latest release compatible with the current ESLint tooling — see [`typescript-eslint`'s TypeScript support policy](https://typescript-eslint.io/users/dependency-versions/) for why this trails npm's absolute-latest `typescript` tag.
- Migrated the package manager from Yarn to npm (single `package-lock.json`, no more `yarn.lock`).
- Adopted React 19's typed JSX namespace (`import type { JSX } from "react"` in place of the removed global `JSX` namespace) across the codebase.
- Added the dark mode toggle, the Lexical-branded header, and the app favicon.
- Wired up several Lexical plugins/nodes (images, inline images, tables, polls, page breaks, horizontal rules) that existed in the codebase but were never connected to the editor, plus the text/background color pickers.
- Implemented `PollComponent`, which had been a `TODO: Implement` stub despite `PollNode` already having a full voting/mutation API.
- Added ESLint (flat config) and Prettier, since neither existed before this pass.

## Acknowledgements

- Built on [Lexical](https://lexical.dev) by Meta Platforms, Inc., licensed under the MIT License.
- The toolbar/plugin/node architecture in this repo is adapted from Lexical's own [playground example](https://github.com/facebook/lexical/tree/main/packages/lexical-playground), also MIT licensed.
- The Lexical logo used in the header and favicon is Meta's own mark, sourced from the official `facebook/lexical` repository.
- Toolbar icons are from [Bootstrap Icons](https://icons.getbootstrap.com) (MIT License).

## License

This repository's own code is provided as-is for demonstration purposes. It builds on and adapts MIT-licensed code and assets from Meta's Lexical project (see Acknowledgements) — no separate root `LICENSE` file has been added yet.
