# Lexical Rich Text Editor

This is a React and TypeScript-based implementation of a fully customizable Lexical Rich Text editor that supports various features such as:

- Bold, italic, underline, and strikethrough formatting
- Font size, color, and background color selection
- Alignment, indentation, and bullet points
- Hyperlinks, images, and emojis
- Undo, redo, and clear actions
- HTML and Markdown export

## Lexical Update (v0.16.0 → v0.40.0)

The Lexical packages (`lexical`, `@lexical/react`, `@lexical/table`) have been upgraded from **v0.16.0** to **v0.40.0**. The following breaking changes were addressed during the migration:

- **`DEPRECATED_$isGridSelection` removed** — Grid selection was removed from the Lexical core. Usages were replaced with `$isRangeSelection` checks where appropriate.
- **`GridSelection` / `NodeSelection` / `RangeSelection` types consolidated** — The separate selection types were unified under `BaseSelection`.
- **`LexicalErrorBoundary` export changed** — Switched from a default import to a named import (`import { LexicalErrorBoundary }`).

## Getting Started

I hope this helps you. 😊
