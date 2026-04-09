# 03. View All Applications: Design Document

## Architecture Overview
The "View All Applications" feature integrates a paginated data table directly into the existing Dashboard. It utilizes a tRPC query to fetch applications for the authenticated user, sorted by application date. The UI is split into a main table component with supporting components for status badges, skeleton loading states, and pagination controls. Data fetching handles empty, loading, and populated states gracefully.

## Database Changes
No schema changes are required as the `Application` and `User` models were established in the "Add Application" feature (02).

## tRPC Backend Logic
**Modified File: `server/routers/applications.ts`**
*   **New Query: `list`**
    *   *Procedure:* `protectedProcedure` (ensures `ctx.user` is available).
    *   *Input Schema:* 
        ```typescript
        z.object({
          page: z.number().int().min(1).default(1),
          limit: z.number().int().min(1).max(100).default(20),
        })
        ```
    *   *Logic:*
        1. Resolve local `User.id` from `ctx.user.id` (Kinde ID).
        2. Execute two Prisma queries (parallelized using `Promise.all` if possible):
           - `prisma.application.count()` filtered by `userId`.
           - `prisma.application.findMany()` with:
             - `where: { userId: dbUser.id }`
             - `orderBy: { dateApplied: 'desc' }`
             - `skip: (page - 1) * limit`
             - `take: limit`
        3. Return an object containing `items` and `totalCount`.

## Frontend Architecture (React Components)

### 1. Dashboard Integration
**Modified File: `app/dashboard/page.tsx`**
*   Convert the dashboard to a Client Component or use a Client Component wrapper for the application list section to leverage `trpc.application.list.useQuery`.
*   Replace the hardcoded empty state placeholder with the `<ApplicationList />` component.
*   The header count "Your Applications (N)" will be updated dynamically based on the total count returned from tRPC.

### 2. New Components (`components/applications/`)

#### [NEW] `ApplicationList.tsx`
*   Main container component for the applications section.
*   Handles pagination state (`page`) and calls `trpc.application.list.useQuery({ page, limit: 20 })`.
*   Conditional rendering logic:
    - If `isLoading`: Render `ApplicationTableSkeleton`.
    - If `data.totalCount === 0`: Render the existing empty state.
    - Otherwise: Render `ApplicationTable` and `Pagination`.

#### [NEW] `ApplicationTable.tsx`
*   Stateless component rendering the HTML `<table>` structure.
*   Implements the 6-column layout (Company, Role, Status, Date, Location, Salary).
*   Maps through `applications` to render `ApplicationRow`.
*   Uses `date-fns` (or standard `Intl.DateTimeFormat`) for readable date formatting (`09 Apr 2026`).
*   Implements the salary formatting logic: `₹{min}L – ₹{max}L`.

#### [NEW] `StatusBadge.tsx`
*   Reusable badge component mapping `ApplicationStatus` to specific Tailwind classes.
*   Palette (Zinc-based):
    - `APPLIED`: Blue (bg-blue-100/10 text-blue-500)
    - `INTERVIEW_SCHEDULED`: Amber
    - `INTERVIEW_DONE`: Orange
    - `OFFER_RECEIVED`: Green
    - `ACCEPTED`: Emerald
    - `REJECTED`: Red
    - `WITHDRAWN`: Zinc

#### [NEW] `Pagination.tsx`
*   Simple navigation component.
*   Props: `currentPage`, `totalPages`, `onPageChange`.
*   Renders Prev/Next buttons and numbered pages (1, 2, 3...).
*   Ensures boundary buttons are disabled when on page 1 or the last page.

#### [NEW] `ApplicationTableSkeleton.tsx`
*   Visual placeholder using pulsing bars (`animate-pulse`).
*   Mimics the table structure to prevent layout shift.

## Addressed Acceptance Criteria Checking
- **AC1 (Scope):** Ensured by `protectedProcedure` pulling `userId` from encrypted context.
- **AC2 (Sort):** Prisma `orderBy: { dateApplied: 'desc' }`.
- **AC3 & AC4 (Columns/Hidden):** Explicitly defined in `ApplicationTable` mapping.
- **AC5 (Empty):** Handled in `ApplicationList` conditional rendering.
- **AC6 (Loading):** Handled via `isLoading` state in `ApplicationList`.
- **AC7 (Count):** Total count passed from tRPC to section header.
- **AC8 & AC9 (Formatting):** Implemented in `ApplicationTable` row mapping.
- **AC10 (Pagination):** Managed in `ApplicationList` state and `Pagination` component.
- **AC11 (Status):** Centralized in `StatusBadge`.
- **AC12 (Row Click):** Table rows rendered as standard `<tr>` without `cursor-pointer` or click listeners.
- **AC13 (tRPC):** No direct Prisma calls in components; logic stays in `applicationsRouter`.
- **AC14 (UI):** Uses existing Tailwind zinc palette and typography.

## Files to Create & Modify

### 1. Backend [Modify]
- [MODIFY] [applications.ts](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/server/routers/applications.ts) -> Add `list` query.

### 2. Components [New]
- [NEW] [ApplicationList.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/components/applications/ApplicationList.tsx)
- [NEW] [ApplicationTable.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/components/applications/ApplicationTable.tsx)
- [NEW] [ApplicationTableSkeleton.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/components/applications/ApplicationTableSkeleton.tsx)
- [NEW] [StatusBadge.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/components/applications/StatusBadge.tsx)
- [NEW] [Pagination.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/components/applications/Pagination.tsx)

### 3. Frontend [Modify]
- [MODIFY] [page.tsx](file:///Users/pagidipallydivyasai/Developer/learning/SDD/job-tracker/app/dashboard/page.tsx) -> Integrate `ApplicationList`.
