## Summary

Add application status mutation

## What changed

Added the protected `application.updateStatus` mutation and router tests, plus an `npm test` script.

## Decisions

Resolve the Kinde ID to a local user as in the existing procedures. Use a single Prisma `update` with both application ID and local user ID in its predicate, avoiding a check-then-update race. Translate Prisma P2025 to `NOT_FOUND`; log and mask other update errors. The status validator uses the generated Prisma enum. Tests mock Prisma rather than requiring a database.

## How each criterion is met

- Owner-only update and returned record: `updates and returns only the owner's status using the local user id`; validation: `validates id and every ApplicationStatus`; authentication: `rejects unauthenticated callers and missing local users`.
- Missing or another user's application: `missing and other users' applications both return NOT_FOUND without changes`.
- Local user lookup and Prisma update: `updates and returns only the owner's status using the local user id` asserts the call order and predicates. Error handling: `logs unexpected update errors and returns a safe internal error` and the NOT_FOUND test. The implementation uses Prisma, not raw SQL.
- Lint and typecheck do **not** pass because of pre-existing repository errors (see Tests); this criterion remains unmet.
- No components or app pages changed; verified with `git diff --stat` and `git status --short`.

## How to verify

Run `npm test`, `npm run lint`, and `npx tsc --noEmit`. The router tests require a generated Prisma client but no database connection.

## Tests

- Added five router tests covering owner scoping, returned record, both NOT_FOUND cases, authentication, local user lookup, input validation for all statuses, and unexpected update errors.
- `node --test server/routers/applications.test.mjs`: 5 passed.
- `npm test`: 5 passed.
- `npx eslint server/routers/applications.test.mjs`: passed. `npx eslint server/routers/applications.ts --rule '@typescript-eslint/no-explicit-any: off'`: passed; this override was used only to isolate the pre-existing `any` in `create`.
- `npm run lint`: failed both before and after the change (437 errors, 1369 warnings), primarily generated Prisma files, plus existing errors in `components/applications/ApplicationTable.tsx`, `lib/test-db.ts`, `lib/test-library.ts`, and the existing `create` handler.
- `npx tsc --noEmit`: failed both before and after the change: implicit `any` in `lib/test-db.ts` and missing `prisma/config` module in `prisma.config.ts`.

## Docs updated

`README.md` documents the mutation, statuses, errors, and test command. Existing instructions and historical feature specs were not affected.

## Open questions

None. The pre-existing lint and typecheck failures need separate cleanup; fixing the component and unrelated files is outside this ticket's scope.
