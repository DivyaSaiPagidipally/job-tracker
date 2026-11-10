This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Applications list

Use the status dropdown above the applications table to show one status, or
select **All statuses** to restore the full list. The count and pagination
reflect the selection. Filtering loads all list pages before showing matches;
large lists may take longer to load.

## Application API

The protected tRPC mutation `application.updateStatus` accepts
`{ id: string, status: ApplicationStatus }` and returns the updated application.
Status must be one of `APPLIED`, `INTERVIEW_SCHEDULED`, `INTERVIEW_DONE`,
`OFFER_RECEIVED`, `REJECTED`, `ACCEPTED`, or `WITHDRAWN`. Only the owner's
application can be updated; a missing or another user's application returns
`NOT_FOUND`. A missing local user returns `UNAUTHORIZED`.

Run tests with `npm test`; router and list component tests use mocked dependencies
and need no database connection.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
