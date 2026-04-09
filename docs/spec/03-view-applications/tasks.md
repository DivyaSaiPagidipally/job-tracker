# 03. View All Applications: Tasks

## Order of Execution
1. Database — Verification of core entities
2. Backend — Paginated tRPC query implementation
3. Frontend — Modular UI components and table logic
4. Auth — Secure integration and user-specific data verification

---

### Task 1: Database Verification
- **Goal:** Confirm the existing Prisma schema supports the necessary fields for listing (Company, Role, Status, Date, Location, Salary).
- **Files to modify:** None (Verification only)
- **Files to check:** `prisma/schema.prisma`
- **Verification:** Ensure the `Application` model has `companyName`, `jobTitle`, `status`, `dateApplied`, `location`, `salaryMin`, and `salaryMax` fields. Run `npx prisma generate` to ensure the client is up to date.

---

### Task 2: Implement Paginated List Query (Backend)
- **Goal:** Create a `list` tRPC query to fetch a user's job applications with support for pagination and descending date sorting.
- **Files to modify:** `server/routers/applications.ts`
- **Logic:**
  - Define Zod input for `page` (default 1) and `limit` (default 20).
  - Use `protectedProcedure` to get the authenticated user's ID.
  - Fetch total count of user's applications.
  - Fetch applications using `skip` and `take` based on pagination, ordered by `dateApplied: 'desc'`.
- **Verification:** Call the query using a temporary test script or via a browser console (once frontend is wired) and confirm it returns `{ items: [...], totalCount: N }` with exactly 20 items or less.

---

### Task 3: Build Core UI Components (Frontend)
- **Goal:** Create modular, reusable components for status badges and the pagination navigation bar.
- **Files to create:**
  - `components/applications/StatusBadge.tsx`: Maps statuses (APPLIED, REJECTED, etc.) to colour-coded Tailwind badges.
  - `components/applications/Pagination.tsx`: Renders numbered buttons, Next, and Previous controls.
- **Files to modify:** None
- **Verification:** Render these components in isolation or on a temporary page with hardcoded props to ensure visual styles (zinc theme) and button states (disabled/active) match requirements.

---

### Task 4: Build Table and Loading State (Frontend)
- **Goal:** Create the main table display and the pulsing skeleton rows for the loading state.
- **Files to create:**
  - `components/applications/ApplicationTableSkeleton.tsx`: Renders pulsing placeholders matching the table row structure.
  - `components/applications/ApplicationTable.tsx`: Renders the 6-column `<table>` with formatted dates (`12 Apr 2026`) and formatted salary (`₹5L – ₹10L`).
  - `components/applications/ApplicationList.tsx`: Parent component that manages `page` state, handles the tRPC query, and toggles between Loading, Empty, and Data views.
- **Verification:** Confirm the table renders exactly 6 columns. Verify that if `salaryMin/Max` are missing, it shows `—`. Verify date formatting uses a readable string.

---

### Task 5: Dashboard Integration and Auth Sync (Auth)
- **Goal:** Replace the dashboard placeholder with the live list and ensure the header count dynamically reflects the authenticated user's total records.
- **Files to modify:** `app/dashboard/page.tsx`
- **Changes:**
  - Remove existing static empty-state div.
  - Inject `<ApplicationList />`.
  - Update the "Your Applications" heading to include the total count from the fetched data.
- **Verification:** Log in with different accounts and confirm each user only sees their own applications. Verify the total count in the header matches the actual number of records in the database for that specific user.
