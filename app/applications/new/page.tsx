import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { AddApplicationForm } from "@/components/applications/AddApplicationForm";

export const metadata = {
  title: "Add Application | Job Tracker",
  description: "Log a new job application to track.",
};

export default async function NewApplicationPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen p-8 bg-zinc-50 dark:bg-black font-sans">
      {/* ── Header — same structure as Dashboard ─────────────────────── */}
      <header className="flex items-center justify-between w-full max-w-5xl mx-auto mb-12">
        <Link
          href="/dashboard"
          className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity"
        >
          Job Tracker
        </Link>

        <div className="flex items-center gap-4">
          {user?.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {user?.given_name || user?.email || "User"}
          </div>
          <LogoutLink className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors">
            Log out
          </LogoutLink>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Back link */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Form card */}
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Add New Application
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Track a job you have applied to. Required fields are marked with{" "}
              <span className="text-red-500">*</span>
            </p>
          </div>

          <AddApplicationForm />
        </div>
      </main>
    </div>
  );
}
