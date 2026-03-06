# Todo App

A React + TypeScript todo list app for testing Fleet kanban automation with Symphony-style skills.

## Environment

- Node.js 22+ / TypeScript 5.7+
- React 19 + Vite + React Router
- Install deps: `npm install`
- Dev server: `npm run dev`
- Quality gate: `npm run check` (build + lint + test)

## Codebase Conventions

- Source lives in `src/`, organized by `components/`, `pages/`, `hooks/`.
- Tests are co-located as `*.test.ts` or `*.test.tsx` files.
- Use Vitest + React Testing Library for testing.
- Use ESLint for linting, Prettier for formatting.
- Conventional commits (see `.omni_code/skills/commit/SKILL.md`).
- Local storage for persistence (no backend).

## Tests and Validation

Run targeted tests while iterating, then run the full gate before handoff:

```bash
# Run all checks (build + lint + test)
npm run check

# Run tests only
npm test

# Run a single test file
npx vitest run src/hooks/useTodos.test.ts

# Lint
npm run lint

# Build
npm run build

# Dev server
npm run dev
```

## Required Rules

- Keep changes narrowly scoped; avoid unrelated refactors.
- All new functions should have tests.
- Follow existing code style and patterns.

## PR Requirements

- PR body must follow `.github/pull_request_template.md`.
- Fill every section with concrete content for the change.
- Replace all placeholder comments.
