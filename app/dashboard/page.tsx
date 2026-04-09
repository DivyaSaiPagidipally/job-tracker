import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen p-8 bg-zinc-50 dark:bg-black font-sans">
      <header className="flex items-center justify-between w-full max-w-5xl mx-auto mb-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Job Tracker
        </h1>

        <div className="flex items-center gap-4">
          {user?.picture && (
            <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full" />
          )}
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Welcome, {user?.given_name || user?.email || "User"}
          </div>
          <LogoutLink className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors">
            Log out
          </LogoutLink>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top action bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Your Applications
          </h2>
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Application
          </Link>
        </div>

        {/* Applications list placeholder */}
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No applications yet.{" "}
            <Link
              href="/applications/new"
              className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2"
            >
              Add your first one →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

