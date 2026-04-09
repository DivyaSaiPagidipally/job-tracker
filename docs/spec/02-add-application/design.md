# 02. Add Application: Design Document

## Architecture Overview
The "Add Application" feature crosses all three core tiers of our stack (Database, tRPC Backend, React Frontend). The data flows structurally from a client-side explicitly typed form inside `/applications/new`, across a tRPC mutation boundary that handles business validation (URL sanitization and Duplicate constraints), and terminates securely inside a Prisma-managed TiDB schema table.

## Database Changes
We will modify `prisma/schema.prisma` to include our new core entity mapping the user's job applications.

1.  **Add `ApplicationStatus` Enum**
    *   `APPLIED`, `INTERVIEW_SCHEDULED`, `INTERVIEW_DONE`, `OFFER_RECEIVED`, `REJECTED`, `ACCEPTED`, `WITHDRAWN`
2.  **Add `Application` Model**
    *   `id` (String UUID @id)
    *   `userId` (String FK -> relationships back to the `User` model)
    *   `companyName` (String)
    *   `jobTitle` (String)
    *   `jobUrl` (String?)
    *   `dateApplied` (DateTime @default(now()))
    *   `status` (ApplicationStatus @default(APPLIED))
    *   `salaryMin` (Int?)
    *   `salaryMax` (Int?)
    *   `location` (String?)
    *   `notes` (Text?) - Note: Standard string natively translates to text bounds.
    *   **Constraint:** `@@unique([userId, companyName, jobTitle])` mapped specifically to enforce duplicate rejection intrinsically at the database level.

## Files to Create & Modify

### 1. Database Layer
**Modified File: `prisma/schema.prisma`**
*   Add the Enum and Model architecture previously defined.
*   *Action:* Developer must run `npx prisma db push` and `npx prisma generate` right after edits.

### 2. tRPC Backend Validation & Routing
**New File: `server/routers/applications.ts`** (or appended to existing router schema)
*   **Zod Schema:**
    *   Create `addApplicationSchema` enforcing explicit structural limits (`companyName` max 100, `jobTitle` max 100, `location` matching enum options gracefully).
*   **Mutation Logic: `create`** 
    *   *Private Procedure:* Ensure `userId` is pulled natively from the secure context layer (Kinde auth).
    *   *URL Interceptor:* Hook `jobUrl` variable. If it does not explicitly start with `http://` or `https://`, rigidly prepend `https://`.
    *   *Prisma Execution:* Wrap Prisma `create` inside a `try/catch` block. Catch explicit Prisma duplicate errors (Code `P2002`) and manually throw a cleanly readable TRPCError with code `CONFLICT` and message `"You have already applied for this role at this company."`

### 3. Frontend Architecture (React Components)
**New File: `app/applications/new/page.tsx`**
*   Server component wrapper serving the structural layout and `<AddApplicationForm />` component child. Ensures Next.js strictly SEO/renders the outer bounds natively.

**New File: `components/applications/AddApplicationForm.tsx`**
*   Client Component (`"use client"`).
*   Hooks cleanly into `useForm` (from `react-hook-form`) with a corresponding `zodResolver`.
*   Includes structurally styled Tailwind UI bounds for every field (Standard text `<input>` blocks, `<select>` for Status dropdown rendering Cities/Remote logic natively, and a generic `<textarea>` for notes).
*   Hooks heavily into `@trpc/client` generated mutation:
    *   *On Success:* Trigger `toast.success("Application tracked.")` natively, then `router.push('/dashboard')`.
    *   *On Error:* Trigger `toast.error(error.message)` isolating explicitly the duplicate warning if generated.
*   **Loading States:** Bind `disabled={isSubmitting}` securely mapping to the native React Hook Form loading hook.

**Modified File: `app/dashboard/page.tsx`**
*   Add an "Add Application" call-to-action graphical button structurally routing standard HTTP logic uniquely towards `/applications/new`.

## Addressed Acceptance Criteria Checking
- *Required Fields Highlighted:* React Hook Form blocks submission natively ensuring the network won't even fire without structurally accurate headers.
- *URL Formatting:* tRPC structurally handles appending `https://` behind the wall.
- *Duplicate Matching:* Prisma `@unique` strictly halts identical data signatures. tRPC manually catches and relays standard text.
- *Redirect Handling:* Handled flawlessly by standard frontend router callback on tRPC success.
