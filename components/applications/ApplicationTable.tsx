import { ApplicationStatus } from "@/app/generated/prisma";
import { StatusBadge } from "./StatusBadge";

// Define a version of Application where Dates can be strings (serialized tRPC response)
type SerializedApplication = Omit<any, "dateApplied" | "createdAt" | "updatedAt"> & {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: Date | string;
  status: ApplicationStatus;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
};

interface ApplicationTableProps {
  applications: SerializedApplication[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (min === null && max === null) return "—";
    
    const formatLakh = (val: number) => {
      const lakhs = val / 100000;
      // Show decimal if it's not a whole number (e.g. 5.5L)
      return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
    };

    if (min !== null && max !== null) {
      return `${formatLakh(min)} – ${formatLakh(max)}`;
    }
    if (min !== null) return formatLakh(min);
    if (max !== null) return formatLakh(max);
    
    return "—";
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="overflow-x-auto text-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Date Applied
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">
                Salary Range
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {applications.map((app) => (
              <tr 
                key={app.id} 
                className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {app.companyName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {app.jobTitle}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDate(app.dateApplied)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                  {app.location || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">
                  {formatSalary(app.salaryMin, app.salaryMax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
