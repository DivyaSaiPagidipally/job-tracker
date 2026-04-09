"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationTableSkeleton } from "./ApplicationTableSkeleton";
import { Pagination } from "./Pagination";

/**
 * Orchestrator component for the applications list.
 * Manages fetching, pagination state, and empty/loading views.
 */
export function ApplicationList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch applications with pagination
  const { data, isLoading, isPlaceholderData } = trpc.application.list.useQuery(
    { page, limit },
    { placeholderData: (previousData) => previousData }
  );

  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Your Applications {data ? `(${data.totalCount})` : ""}
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

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className={isPlaceholderData ? "opacity-50 pointer-events-none" : ""}>
        {isLoading && !data ? (
          <ApplicationTableSkeleton />
        ) : data?.totalCount === 0 ? (
          <div className="p-12 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="max-w-xs mx-auto">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                No applications yet.{" "}
                <Link
                  href="/applications/new"
                  className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Add your first one →
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <>
            <ApplicationTable applications={data?.items || []} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
