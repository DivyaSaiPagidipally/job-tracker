# 01 Authentication Tasks

## Order of Execution
1. Database (Prisma modeling and TiDB Serverless syncs)
2. Backend (API Routes and middleware protection)
3. Frontend (Pages and internal callback endpoints)
4. Auth (Environment and Dashboard logic constraints)

---

### Task 1: Update Database Schema (Database)
- **Goal:** Introduce a robust local `User` entity modeling allowing us to internally map abstract Kinde credentials onto persistent relational ID targets locally.
- **Files to modify:** `prisma/schema.prisma`
- **Verification:** Run `npx prisma generate` followed by `npx prisma db push` to synchronize changes aggressively up to the TiDB Serverless boundary.

### Task 2: Install SDK Dependencies (Backend)
- **Goal:** Wire the Next.js module to Kinde OS logic frameworks.
- **Files to modify:** `package.json`
- **Verification:** Execute `npm install @kinde-oss/kinde-auth-nextjs`. Verify success and lockfile updates visually.

### Task 3: Setup Kinde Auth Hook Router (Backend)
- **Goal:** Establish root proxy links handling standard redirect events natively.
- **Files to create:** `app/api/auth/[kindeAuth]/route.ts`
- **Verification:** Navigating to `http://localhost:3000/api/auth/login` while server handles no 404 boundaries structurally.

### Task 4: Setup Route Access Protection Middleware (Backend)
- **Goal:** Wrap standard entry layers blocking unregistered users via Kinde's Next.js edge functions.
- **Files to create:** `middleware.ts`
- **Verification:** Standard module build compiles efficiently. Final verification rests on testing.

### Task 5: Implement Auth Callback DB Sync (Frontend/Backend)
- **Goal:** Provide a dedicated server callback endpoint that captures verified payload metadata, securely mutations matching state details via `prisma.user.upsert()`, then automatically advances users to the dashboard.
- **Files to create:** `app/auth-callback/page.tsx`
- **Verification:** File exposes core internal logic running native DB validation checking before exporting an immediate Next.js `redirect('/dashboard')`.

### Task 6: Implement Root Route Directives (Frontend)
- **Goal:** Ensure visiting the root URL `/` operates smartly by assessing state validation thresholds initially.
- **Files to modify:** `app/page.tsx`
- **Verification:** Core `getKindeServerSession().isAuthenticated()` check successfully gates traffic.

### Task 7: Establish Base Dashboard UX (Frontend)
- **Goal:** Build a basic landing node handling all post-sync events containing standard Kinde logout hooks targeting session destruction loops natively.
- **Files to create:** `app/dashboard/page.tsx`
- **Verification:** Exposes Server Component with active `<LogoutLink>` interface buttons.

### Task 8: Internal Environment Authentication Linking (Auth)
- **Goal:** Set variable contexts pointing exclusively to testing project constraints and the new `auth-callback` integration paths locally.
- **Files to modify:** `.env`
- **Verification:** `KINDE_POST_LOGIN_REDIRECT_URL` variable exactly matching `http://localhost:3000/auth-callback`.

### Task 9: Kinde Dashboard Modification (Auth)
- **Goal:** Validate aesthetic thresholds updating external parameter tracking visually.
- **Files to modify:** None (Kinde online dashboard exclusively)
- **Verification:** Login forms physically demonstrate a "Job Tracker" header centered within constraints securely.

---

## Final Verification
1. Access `http://localhost:3000/`. Server gracefully pushes you out to a centered Kinde portal handling UI states natively.
2. Complete new user lifecycle signup.
3. System reroutes you locally returning to `http://localhost:3000/auth-callback`.
4. Page invisibly fires Prisma queries securely tracking payload and assigning a valid internal `id` target before moving you to `/dashboard`.
5. Audit TiDB Serverless tables securely (via `npx prisma studio` etc) proving creation logic maps permanently tying internal state architectures cleanly to the identity ID.
