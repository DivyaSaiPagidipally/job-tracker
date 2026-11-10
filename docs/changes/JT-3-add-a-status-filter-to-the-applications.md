## Summary
Add status filter to applications list

## What changed
- Added a labelled status dropdown, filtered count and pagination, and a distinct no-matches message.
- Added component tests and included them in `npm test`.

## Decisions
- The existing list API accepts no status filter. When a status is selected, the client fetches all pages in batches of 100 using tRPC, then filters and paginates locally. This avoids filtering only the current page without changing the router or table. It may be slower for large lists; concurrent changes during batch fetching can affect consistency.
- Filter changes reset to page 1. Failed batches show a safe error and toast instead of partial matches. Select All statuses and then a status to try again.

## How each criterion is met
- Dropdown above table, All statuses, all enum values: `dropdown is labelled, styled, above the table and contains every status`.
- Selecting a status shows only matches across pages: `each status selection returns only its matching applications` and `status filters all batches, paginates matches, and all statuses restores the list`.
- All statuses restores the full paginated list: `status filters all batches, paginates matches, and all statuses restores the list`.
- Tailwind styling: `dropdown is labelled, styled, above the table and contains every status` checks the zinc dark styling; the control also uses the surrounding zinc light/dark palette.
- No router or ApplicationTable changes: inspect `git diff`.

## How to verify
1. Sign in, add applications with different statuses, and open the dashboard.
2. Select each status above the table and check matching rows and pagination; select All statuses to restore the list. Check a status with no matches and both light and dark themes.
3. For more than 100 applications, verify matches beyond the first batch appear on the filtered pages.

## Tests
- Added five component tests with mocked hooks and tRPC: dropdown, cross-batch filtering and reset, every status, loading/empty state, and first/later batch errors. No browser screenshot test was run.
- `npm test`: initially 5 existing tests passed; after addition 9 passed, then final run 10 passed.
- `npx eslint components/applications/ApplicationList.tsx components/applications/ApplicationList.test.mjs`: passed.
- `npx tsc --noEmit`: failed on existing `lib/test-db.ts` implicit any and missing `prisma/config` in `prisma.config.ts`; no errors in changed files.
- `npm run lint`: failed with 437 errors and 1369 warnings, including generated Prisma files and existing `ApplicationTable.tsx`, `lib/test-db.ts`, `lib/test-library.ts`, and `server/routers/applications.ts`; no errors in changed files.

## Docs updated
- README applications list and test instructions; view-applications requirements and design. No API contract or agent instructions changed.

## Open questions
- None.
