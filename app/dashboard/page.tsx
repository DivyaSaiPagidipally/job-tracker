import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { ApplicationList } from "@/components/applications/ApplicationList";

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
        <ApplicationList />
      </main>
    </div>
  );
}

