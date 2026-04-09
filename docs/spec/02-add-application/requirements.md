# 02. Add Application

## Goal
Provide a dedicated, robust interface for job seekers to track new job applications, capturing essential details like company names, roles, compensation, and statuses cleanly and securely into the database.

## User Stories
- As a job seeker, I want to quickly log a new application so that I can keep track of where I have applied.
- As a job seeker, I want to record compensation bounds (min/max salary) so I can evaluate offers later.
- As a job seeker, I want the system to warn me if I attempt to accidentally apply to the exact same role at the same company twice.
- As a job seeker, I want to easily tag the location of the job using a quick list of major tech metropolitan hubs (or Remote).

## What users see
- A dedicated page at `/applications/new` featuring a clean, responsive form.
- Input fields for:
  - **Company** (Required, Text)
  - **Role/Job Title** (Required, Text)
  - **Job URL** (Optional, Text — automatically corrects missing `https://`)
  - **Date Applied** (Required, DatePicker — defaults to today)
  - **Status** (System locked visually to "Applied" on creation)
  - **Salary Range** (Optional, two Number inputs: Min and Max)
  - **Location** (Optional, Dropdown: Bangalore, Chennai, Mumbai, Hyderabad, Remote, Other)
  - **Notes/Remarks** (Optional, plain text area)
- A "Save Application" submit button that visually disables itself with a loading state while the background network request processes.
- A success toast notification informing them the job was tracked, immediately followed by an automatic browser redirect back to the Dashboard.

## Acceptance Criteria
- **Validation**: 
  - Submitting an empty form or missing the Company/Role must immediately highlight errors and halt submission natively.
  - Job URLs submitted without protocols (e.g. `google.com`) must gracefully auto-format to `https://google.com` before database insertion.
- **Constraints**: 
  - The database must reject duplicate entries where the `userId`, `companyName`, and `jobTitle` identically collide.
  - If a collision occurs, a toast error must surface specifically stating: "You have already applied for this role at this company."
- **Data Persistence**: 
  - Safely insert the payload into the `Application` Prisma model via tRPC and associate it securely with the currently logged-in user.
- **Routing**: 
  - After a successful 200 OK network save, auto-redirect the user to `/dashboard`.

## Out of Scope
- Rich text editors for the notes field (sticking to standard plain text for now).
- Ability to parse or scrape the job details automatically from the Job URL.
- Advanced application stages beyond the initial "Applied" status during this explicit creation flow.
- Uploading resume documents or cover letters alongside the entry.