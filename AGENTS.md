<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Job Application Tracker

## What This App Does
Helps job seekers track their job applications,
update statuses, add notes and see progress
on a dashboard.

## Tech Stack
- Framework: Next.js 14 (App Router)
- API: tRPC
- Database: TiDB Serverless (MySQL) + Prisma ORM
- Auth: Kinde
- File Storage: Uploadthing
- Styling: Tailwind CSS
- Notifications: react-hot-toast
- Hosting: Vercel

## Folder Structure
- app/ → Next.js pages and API routes
- components/ → Reusable UI components
- server/routers/ → tRPC routers (backend logic)
- prisma/ → Database schema
- docs/specs/ → SDD spec files per feature
- lib/ → Utility functions

## Code Conventions
- Server components by default
- "use client" only when state/interaction needed
- tRPC for ALL API calls — no direct DB in components
- Prisma for ALL database queries
- All routes protected by withAuth middleware
- Toast notifications for all user feedback
- Mobile first Tailwind classes
- **UI Consistency**: Ensure all new pages strictly inherit and match the clean aesthetic and UI formatting of the main Dashboard layout.
- Feature folders in components/
  e.g. components/applications/ApplicationCard.tsx

## Naming Conventions
- Components: PascalCase
- Files: camelCase
- Database models: PascalCase
- tRPC routers: camelCase

## Git Convention
- Commit after each completed task
- Branch per feature
- e.g. feature/add-application

## Error Handling
- Always show toast on error
- Always show toast on success
- Never show raw error messages to users
- Log errors to console for debugging

## What NOT To Do
- No raw SQL queries — always use Prisma
- No fetch() calls from frontend — always tRPC
- No storing sensitive data in localStorage
- No skipping loading states on mutations
- No paid services — ALWAYS use free versions and free plans for all setups within the entire application.