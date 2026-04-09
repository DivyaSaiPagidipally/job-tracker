# 02. Add Application: Tasks

## Order of Execution
1. Database — Schema changes and sync to TiDB
2. Backend — tRPC router setup and business logic
3. Frontend — Form page and component UI
4. Integration — Dashboard button and final wiring

---

### Task 1: Extend Prisma Schema with Application Model (Database)
- **Goal:** Add the `ApplicationStatus` enum and the `Application` model to the Prisma schema, including the unique constraint that enforces duplicate blocking at the database level.
- **Files to modify:** `prisma/schema.prisma`
- **Changes:**
  - Add `enum ApplicationStatus` with values: `APPLIED`, `INTERVIEW_SCHEDULED`, `INTERVIEW_DONE`, `OFFER_RECEIVED`, `REJECTED`, `ACCEPTED`, `WITHDRAWN`
  - Add `model Application` with all fields: `id`, `userId`, `companyName`, `jobTitle`, `jobUrl`, `dateApplied`, `status`, `salaryMin`, `salaryMax`, `location`, `notes`, `createdAt`, `updatedAt`
  - Add a `@@unique([userId, companyName, jobTitle])` constraint
  - Add a relation from `User` to `Application[]`
- **Verification:** Run `npx prisma db push` and `npx prisma generate`. Confirm no errors. The `Application` table should now exist in TiDB Serverless.

---

### Task 2: Setup tRPC Base Infrastructure (Backend)
- **Goal:** Establish the core tRPC server instance, context (with Kinde auth), and HTTP handler so all routers can be wired up cleanly.
- **Files to create:**
  - `server/trpc.ts` — Create tRPC instance, define context with Kinde `getUser`, define `publicProcedure` and `protectedProcedure`
  - `server/routers/index.ts` — Create root App Router merging all sub-routers
  - `app/api/trpc/[trpc]/route.ts` — Create the Next.js App Router HTTP handler for tRPC
- **Files to modify:** `package.json` — Install `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@tanstack/react-query`, `zod`, `react-hook-form`, `@hookform/resolvers`
- **Verification:** Start `npm run dev`. Visiting `http://localhost:3000/api/trpc` should return a valid tRPC response (not a 404).

---

### Task 3: Setup tRPC Client Provider (Backend/Frontend)
- **Goal:** Wire the tRPC React client so frontend components can call mutations using the `trpc.xxx.useMutation()` hook pattern.
- **Files to create:**
  - `lib/trpc.ts` — Client-side tRPC instance configured with `httpBatchLink`
  - `components/providers/TrpcProvider.tsx` — `"use client"` wrapper component holding `QueryClientProvider` and `trpc.Provider`
- **Files to modify:** `app/layout.tsx` — Wrap the app with `<TrpcProvider>`
- **Verification:** No console errors on page load. `trpc` client is accessible from any client component without TypeScript errors.

---

### Task 4: Build the Application tRPC Router (Backend)
- **Goal:** Create the `applications` tRPC router with a `create` mutation that validates inputs with Zod, sanitizes the Job URL, saves to the database via Prisma, and handles duplicate errors gracefully.
- **Files to create:** `server/routers/applications.ts`
- **Logic to implement:**
  - Zod input schema validating required fields (`companyName`, `jobTitle`) and all optional fields
  - URL sanitizer: if `jobUrl` is provided and does not start with `http://` or `https://`, prepend `https://`
  - `prisma.application.create()` wrapped in a `try/catch`; catch Prisma error code `P2002` and throw `TRPCError({ code: "CONFLICT", message: "You have already applied for this role at this company." })`
- **Files to modify:** `server/routers/index.ts` — Merge `applicationsRouter` into the root router
- **Verification:** Using a tRPC test or direct call, submitting valid data should create a row in the `Application` table. Submitting a duplicate should return the conflict error message.

---

### Task 5: Build the Add Application Form Component (Frontend)
- **Goal:** Create a polished, fully validated client-side form component matching the Dashboard's UI aesthetic that calls the tRPC `application.create` mutation.
- **Files to create:** `components/applications/AddApplicationForm.tsx`
- **UI fields to include:**
  - Company Name (required text input)
  - Job Title (required text input)
  - Job URL (optional text input)
  - Date Applied (date input, defaulted to today)
  - Salary Min / Salary Max (optional number inputs, side-by-side)
  - Location (dropdown: Bangalore, Chennai, Mumbai, Hyderabad, Remote, Other)
  - Notes (optional textarea)
  - Status (displayed as read-only "Applied" badge — not editable on creation)
- **Behaviour:**
  - `react-hook-form` with `zodResolver` for client-side validation
  - Submit button disabled with loading text while `isSubmitting` is true
  - On success: `toast.success("Application saved!")` then `router.push("/dashboard")`
  - On error: `toast.error(error.message)` to surface duplicate or server errors
- **Verification:** All fields render correctly. Submitting empty required fields shows inline validation errors without making any network calls.

---

### Task 6: Build the New Application Page (Frontend)
- **Goal:** Create the dedicated `/applications/new` page that hosts the form, matching the Dashboard's overall layout and header style.
- **Files to create:** `app/applications/new/page.tsx`
- **Layout requirements:** Same header style as Dashboard (app title + user info area). Clean centered form card. "Back to Dashboard" navigation link.
- **Verification:** Navigating to `http://localhost:3000/applications/new` renders the full form page without errors. The middleware should redirect unauthenticated users away.

---

### Task 7: Add "Add Application" Button to Dashboard (Integration)
- **Goal:** Wire the Dashboard landing page to the new form by adding a prominent "Add Application" button.
- **Files to modify:** `app/dashboard/page.tsx`
- **Verification:** Clicking "Add Application" on the Dashboard navigates to `/applications/new`.

---

## Final Verification
1. Log in and land on `/dashboard`.
2. Click "Add Application" → confirm routing to `/applications/new`.
3. Submit form with Company Name and Job Title left empty → confirm inline validation errors appear and no network request is fired.
4. Fill in all fields with a valid company/role and submit → confirm success toast and auto-redirect back to `/dashboard`.
5. Immediately submit the exact same form again → confirm the duplicate error toast: "You have already applied for this role at this company."
6. Submit a Job URL as `google.com` → confirm it is saved in the database as `https://google.com`.
