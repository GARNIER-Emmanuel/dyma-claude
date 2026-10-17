# Repository Guidelines

## Project Structure & Module Organization

JobView is an Angular application for recording interviews and comparing offers. Read `design-doc.md` for business rules and `README.md` for setup.

- `src/main.ts`: application bootstrap.
- `src/app/`: standalone components, templates, configuration, and future business types and storage service. Colocate tests with their implementation.
- `src/styles.css`: global CSS; `src/index.html`: French-language document shell.
- `public/`: static assets.
- Root configuration: `angular.json`, `tsconfig*.json`, and pnpm files.
- `dist/jobview/browser/`: generated production site; never commit build output or caches.

## Build, Test, and Development Commands

Use Node.js **24.18.1** and pnpm **10.15.1**.

- `pnpm install --frozen-lockfile`: install locked dependencies.
- `pnpm dev`: start development at `http://localhost:4200`.
- `pnpm test`: run unit tests once, without watch mode.
- `pnpm build`: compile the production site for the planned Vercel deployment.

Keep dependency versions exact and update `pnpm-lock.yaml` with dependency changes. Preserve `.npmrc` installation settings.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, UTF-8, final newlines, and single quotes in TypeScript. Respect strict TypeScript and Angular template checking. Use PascalCase class names and descriptive kebab-case filenames such as `interview-storage.ts`; retain existing root filenames. Keep user-facing text in French.

Prefer small components and plain business functions. Avoid shared packages or extra abstraction layers without a concrete need. No formatter or lint command is currently configured.

## Testing Guidelines

Tests use Angular TestBed, Vitest, and jsdom. Name files `*.spec.ts`; the existing `app.spec.ts` checks startup and the title. No numeric coverage threshold is configured.

For feature changes, cover validation, missing versus zero ratings, and relevant persistence failures using fictional data. Verify mobile behavior and persistence in a browser. Run `pnpm test` and `pnpm build` before submitting code changes.

## Commit & Pull Request Guidelines

There are no commits yet, so no historical convention exists. Use concise, imperative messages, for example `Add interview form validation`. Keep commits focused and stage files selectively.

Pull requests should explain behavior changes, link relevant issues, report verification results, and include screenshots for visual changes. Identify incomplete acceptance checks.

## Data Safety & Scope

V1 keeps business data in the browser. Route all localStorage operations through one service with a versioned format. Never overwrite unreadable or unknown-version data; show save failures. Confirm deletions and clear only JobView data. Render input as text. Never commit secrets or real personal data.

## Agent Instructions

When the user invokes `/graphify`, read and follow `~/.agents/skills/graphify/SKILL.md` before other work.
