## Summary
Show job posting links in the applications table

## What changed
- Added a Job URL column displaying the URL as a link or an em dash when absent.
- Added component rendering tests and an `npm test` script.

## Decisions
- Used a standard anchor for external links and the existing empty-cell styling for missing URLs.
- Replaced the table's existing `any`-based type with its explicit fields, including `jobUrl`.
- Left unrelated pre-existing lint and typecheck errors untouched, including generated Prisma code and the router, to respect the ticket's scope.

## How each criterion is met
- URL, new tab and `noopener noreferrer`: `job URL column renders the URL as a secure new-tab link`.
- Null URL and empty-cell style: `null job URL renders an em dash styled like an empty location`.
- `npm run lint` does **not** pass: it already failed before this change; see Tests below. The changed component and test pass targeted lint.
- No changes to `server/routers/` or other components: checked with `git status` and `git diff`; no automated test covers this scope constraint.

## How to verify
- Run `npm test` and `npx eslint components/applications/ApplicationTable.tsx components/applications/ApplicationTable.test.mjs`.
- On the dashboard, inspect an application with a URL and one without; open the link and confirm it opens in a new tab.
- Run `npm run lint` and `npx tsc --noEmit` to reproduce the existing project-wide failures.

## Tests
- Added two Node tests rendering the table to static HTML; direct `node --test components/applications/ApplicationTable.test.mjs` and `npm test` both passed (2 tests).
- Targeted ESLint passed for the table and its test.
- `npm run lint` failed before the change (437 errors, 1369 warnings) and after it (436 errors, 1369 warnings). Remaining errors are in generated Prisma files, `lib/test-db.ts`, `lib/test-library.ts`, and `server/routers/applications.ts`.
- `npx tsc --noEmit` failed both before and after the change: implicit `any` in `lib/test-db.ts` and missing `prisma/config` in `prisma.config.ts`. No type errors were introduced by this change.

## Docs updated
- Updated `README.md` and the view-applications requirements and design. No API or agent-instruction changes were needed.

## Open questions
- None. Project-wide lint and typecheck failures need separate cleanup; lint acceptance remains unmet.
