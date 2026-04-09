# Authentication

## Goal
Implement a robust authentication system using Kinde to secure the Job Tracker application. Ensure users can register, log in, manage their passwords, and be appropriately routed between public and private areas. Additionally, synchronize the authenticated identity into the local application database to establish a stable local ID for future relational data.

## User Stories
- As an unauthenticated user, I want to be redirected to the login page when accessing the site so that I can authenticate.
- As a new user, I want to be able to sign up using my email and a password so that I can create an account on the Job Tracker.
- As an existing user, I want to log in using my email and password so that I can access my dashboard.
- As an existing user who forgot their password, I want an option to reset it so that I can regain access to my account.
- As an authenticated user, I want to be automatically redirected to the dashboard when visiting the root page so that I don't see the login page again.
- As an authenticated user, I want to be able to log out securely and be taken back to the login page.
- As the system, I want to automatically synchronize the Kinde user profile into the local database upon login, so that all jobs and actions can be tied to a local database user ID rather than relying solely on an external identity provider ID.

## What users see
- Kinde's hosted login and signup pages.
- The Kinde pages will feature the application title "Job Tracker".
- The login input fields and details will be vertically and horizontally centered on the page.
- A brief, seamless "callback" verification process before landing securely on the dashboard.

## Acceptance Criteria
- **AC1:** Visiting the root URL (`/`) while unauthenticated immediately redirects the user to the Kinde Login page.
- **AC2:** Visiting the root URL (`/`) while authenticated immediately redirects the user to `/dashboard`.
- **AC3:** The login page supports email and password authentication.
- **AC4:** The login page contains a working "Forgot Password" link that initiates a password reset flow.
- **AC5:** The signup flow successfully creates a new user account via Kinde.
- **AC6:** Following a successful authentication event with Kinde, the system redirects to an internal processing route (`/auth-callback`).
- **AC7:** The internal processing route checks if the user's Kinde ID exists in the local database. If it doesn't, it creates the local `User` record. If it does, it updates the record if any details (like email or name) changed.
- **AC8:** The internal processing route guarantees a permanent reference mapping via the internal local DB `id` (not the Kinde ID) for deep system context, before finalizing a redirect out to the `/dashboard` route.
- **AC9:** Triggering a logout action successfully ends the user session and redirects them back to the login page.
- **AC10:** The Kinde authentication pages have the title "Job Tracker" and a centered layout.

## Out of Scope
- Creating fully custom UI pages for Login, Sign-up, or Password Reset within the Next.js app (using Kinde hosted pages).
- Complex Social logins (e.g., Google, GitHub) integration.
- Email verification custom logic.
- User profile management or settings page within the Next.js app.
