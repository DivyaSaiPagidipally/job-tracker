# 01 Authentication Design

## Architecture Overview
We will integrate Kinde Authentication using the `@kinde-oss/kinde-auth-nextjs` SDK in our Next.js App Router project. While Kinde handles external credential management, we will intercept the post-login flow using an `auth-callback` route. This route dynamically synchronizes the user's profile and state from Kinde into our local TiDB Serverless/Prisma database. As specified, the remainder of the robust application will strictly reference the local Prisma DB's internal `id` instead of locking directly to Kinde's structure forever.

## Addressing Acceptance Criteria
- **AC1 & AC2 (Root Redirects):** Handled in `app/page.tsx`. `getKindeServerSession().isAuthenticated()` dictates the redirect path natively.
- **AC3-AC5 & AC10 (Login/Signup/Branding):** Handled effectively by Kinde's hosted pages, bridged using the internal SDK hook via `app/api/auth/[kindeAuth]/route.ts`.
- **AC6, AC7 & AC8 (DB Sync & Internal Routing):** 
  - Kinde's `.env` setting for `KINDE_POST_LOGIN_REDIRECT_URL` will point explicitly to `http://localhost:3000/auth-callback`.
  - The `/auth-callback` route will be constructed as a Next.js Server Component that extracts the session and triggers a database `upsert` query via Prisma via a `kindeId` lookup. Matches trigger an update with the latest fresh user details, and misses trigger a create.
  - Upon a successful Prisma commit, Next.js executes `redirect('/dashboard')`.
- **AC9 (Logout Redirect):** Configured directly via the `.env` target `KINDE_POST_LOGOUT_REDIRECT_URL`.

## Database Changes
We must deploy a new Prisma entity schema mapping Kinde to a local architecture.

### Prisma Schema
```prisma
model User {
  id        String   @id @default(cuid())
  kindeId   String   @unique
  email     String   @unique
  firstName String?
  lastName  String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Files to Create and Modify

### 1. `prisma/schema.prisma` [Modify]
- **Strategy:** Add the robust `User` model structured above. Ensure `id` defaults to `cuid()` locally while retaining `kindeId` as an unguessable UUID.

### 2. `package.json` [Modify]
- **Strategy:** Add `@kinde-oss/kinde-auth-nextjs` dependency via `npm`. Ensure existing `prisma` tooling matches current versions.

### 3. `.env` / `.env.local` [Modify]
- **Strategy:** Establish Kinde authentication thresholds. Specifically redirect post-login triggers to our new sync layer.
```env
KINDE_CLIENT_ID=<provided-by-kinde>
KINDE_CLIENT_SECRET=<provided-by-kinde>
KINDE_ISSUER_URL=<provided-by-kinde>
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/auth-callback
```

### 4. `app/api/auth/[kindeAuth]/route.ts` [New]
- **Strategy:** Establish Next.js gateway hooks exporting `handleAuth`.

### 5. `middleware.ts` [New]
- **Strategy:** Implement root edge protection to ensure unverified users do not bypass safety mechanisms into protected dashboard tiers. Use out-of-the-box `authMiddleware`.

### 6. `app/auth-callback/page.tsx` [New]
- **Strategy:** Implement as a server-side route wrapper executing a seamless Prisma connection querying the authenticated Kinde payload via `getKindeServerSession().getUser()`. Write mutations into TiDB Serverless via an `upsert`, wait for the Promise return, and finally fire `redirect('/dashboard')`.

### 7. `app/page.tsx` [Modify]
- **Strategy:** Handle base UX entry redirect parameters. Valid sessions route out to the standard dashboard, invalid forces auth initiation.

### 8. `app/dashboard/page.tsx` [New]
- **Strategy:** Provide a testable output area with logout components ensuring system connectivity functions seamlessly across all environments.
