import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (isAuth) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex flex-col items-center justify-center text-center max-w-2xl gap-8">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Job Tracker
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Manage your job applications, track your interview process, and land your dream job securely.
        </p>
        
        <div className="flex items-center gap-4 mt-4">
          <LoginLink className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Sign in
          </LoginLink>
          <RegisterLink className="rounded-md bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:ring-zinc-700">
            Create an account
          </RegisterLink>
        </div>
      </main>
    </div>
  );
}
