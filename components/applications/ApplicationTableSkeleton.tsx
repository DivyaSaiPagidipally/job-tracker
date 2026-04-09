export function ApplicationTableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {["Company", "Role", "Status", "Date Applied", "Location", "Salary Range"].map((header) => (
                <th key={header} className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
