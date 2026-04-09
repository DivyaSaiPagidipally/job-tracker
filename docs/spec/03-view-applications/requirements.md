# 03. View All Applications

## Goal
Replace the static placeholder on the Dashboard with a real, paginated table that displays all of the authenticated user's tracked job applications — giving them an instant, scannable overview of their entire job-hunt pipeline at a glance.

## User Stories
- As a job seeker, I want to see all my tracked applications in a table on my dashboard so that I can review my pipeline at a glance.
- As a job seeker, I want the table to show the most recently applied jobs first so that I can focus on my latest activity.
- As a job seeker, I want to see the status of each application highlighted with a badge so that I can instantly identify where each opportunity stands.
- As a job seeker, I want to see a count of all my applications in the section heading so that I know how many I have tracked in total.
- As a job seeker, I want the table to be paginated so that a large list of applications does not overwhelm the page.
- As a job seeker, I want to see a friendly empty state when I have no applications yet, with a prompt to add my first one.
- As a job seeker, I want to see animated skeleton rows while my applications are loading so that the page feels responsive.

## What Users See

### Table Columns
The applications table displays the following columns, in order:

| Column | Source Field | Display Format |
|---|---|---|
| **Company** | `companyName` | Plain text |
| **Role** | `jobTitle` | Plain text |
| **Status** | `status` | Colour-coded badge |
| **Date Applied** | `dateApplied` | Readable: `09 Apr 2026` |
| **Location** | `location` | Plain text, `—` if empty |
| **Salary Range** | `salaryMin` / `salaryMax` | `₹5L – ₹10L`; `—` if both absent |

### Status Badge Colours
Each status is visually distinguished by a badge colour that fits the existing dashboard palette:

| Status | Badge Colour |
|---|---|
| `APPLIED` | Blue |
| `INTERVIEW_SCHEDULED` | Amber |
| `INTERVIEW_DONE` | Orange |
| `OFFER_RECEIVED` | Green |
| `ACCEPTED` | Emerald / Dark Green |
| `REJECTED` | Red |
| `WITHDRAWN` | Zinc / Grey |

> Colours are applied only if they harmonise with the existing `zinc`-based dashboard palette; otherwise badges fall back to neutral styling.

### Section Header
- Displays **"Your Applications (N)"** where `N` is the total count of all applications for the user (not just the current page).
- The existing "Add Application" button remains in the top-right of this section.

### Empty State
- Preserved exactly as-is from the current dashboard when the user has **zero** applications:
  > *"No applications yet. Add your first one →"*
- The table is **not rendered** in this state.

### Loading State
- While the tRPC query is in-flight, the table structure is rendered with **animated skeleton rows** (grey pulsing bars) in place of real data.

### Pagination
- Located below the table.
- Displays **20 applications per page**, sorted newest first by `dateApplied`.
- Controls: `← Previous` button · numbered page buttons (1, 2, 3 …) · `Next →` button.
- The current page button is visually highlighted.
- Previous is disabled on page 1; Next is disabled on the last page.

## Acceptance Criteria

- **AC1 — Data scope:** The table only ever shows applications belonging to the currently authenticated user. No cross-user data leakage is possible.
- **AC2 — Sort order:** Applications are always returned sorted by `dateApplied` descending (newest first).
- **AC3 — Columns displayed:** The table renders exactly six columns: Company, Role, Status, Date Applied, Location, Salary Range.
- **AC4 — Hidden fields:** `jobUrl` and `notes` are not shown in the table.
- **AC5 — Empty state:** When the user has zero applications, the existing empty-state message is shown and no table is rendered.
- **AC6 — Loading state:** Skeleton rows are displayed while the data fetch is in progress.
- **AC7 — Total count:** The section heading reads "Your Applications (N)" reflecting the accurate total, not just the page count.
- **AC8 — Salary formatting:** Salary is shown as `₹XL – ₹YL` using Indian Lakhs notation. If one or both values are absent, the cell displays `—`.
- **AC9 — Date formatting:** `dateApplied` renders in human-readable format, e.g. `09 Apr 2026`.
- **AC10 — Pagination:** The table paginates at 20 rows per page. Numbered page buttons plus Previous/Next controls are visible. Boundary buttons are disabled appropriately.
- **AC11 — Status badges:** Each status value renders as a labelled badge with a distinct colour consistent with the dashboard's existing design palette.
- **AC12 — Row click:** Rows are not clickable. No navigation or detail expansion occurs on row interaction.
- **AC13 — tRPC:** All data fetching goes through a tRPC `protectedProcedure` query. No direct database calls from the component layer.
- **AC14 — UI consistency:** The table and pagination controls strictly inherit the dashboard's existing `zinc`-based light/dark theme and typography.

## Out of Scope
- Clicking a row to navigate to a detail or edit page (future feature).
- Sorting the table by any column other than `dateApplied` (covered in **07-search-filter**).
- Filtering or searching applications (covered in **07-search-filter**).
- Inline editing of any field directly from the table.
- Displaying `jobUrl` or `notes` in the list view.
- Exporting the table to CSV or any other format.
- Infinite scroll as an alternative to pagination.
