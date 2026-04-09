"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { trpc } from "@/lib/trpc";

// ─── Validation Schema ────────────────────────────────────────────────────────
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().optional(),
  dateApplied: z.string().min(1, "Date applied is required"),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Location Options ─────────────────────────────────────────────────────────
const LOCATIONS = [
  { value: "", label: "Select a location (optional)" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Chennai", label: "Chennai" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Remote", label: "Remote" },
  { value: "Other", label: "Other" },
];

// ─── Helper: today's date as a yyyy-mm-dd string ─────────────────────────────
function todayString() {
  return new Date().toISOString().split("T")[0];
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AddApplicationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateApplied: todayString(),
      location: "",
    },
  });

  const { mutateAsync: createApplication } =
    trpc.application.create.useMutation({
      onSuccess: () => {
        toast.success("Application saved successfully!");
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  async function onSubmit(values: FormValues) {
    await createApplication({
      companyName: values.companyName,
      jobTitle: values.jobTitle,
      jobUrl: values.jobUrl || undefined,
      dateApplied: values.dateApplied,
      salaryMin: values.salaryMin ? parseInt(values.salaryMin, 10) : undefined,
      salaryMax: values.salaryMax ? parseInt(values.salaryMax, 10) : undefined,
      location: values.location || undefined,
      notes: values.notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ── Row: Company & Job Title ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("companyName")}
            placeholder="e.g. Google"
            className={inputClass(!!errors.companyName)}
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("jobTitle")}
            placeholder="e.g. Software Engineer"
            className={inputClass(!!errors.jobTitle)}
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-500">{errors.jobTitle.message}</p>
          )}
        </div>
      </div>

      {/* ── Row: Job URL & Date Applied ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Job URL <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <input
            {...register("jobUrl")}
            placeholder="e.g. google.com/careers/123"
            className={inputClass(false)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date Applied <span className="text-red-500">*</span>
          </label>
          <input
            {...register("dateApplied")}
            type="date"
            className={inputClass(!!errors.dateApplied)}
          />
          {errors.dateApplied && (
            <p className="text-xs text-red-500">{errors.dateApplied.message}</p>
          )}
        </div>
      </div>

      {/* ── Row: Salary Min & Max ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Salary Min <span className="text-zinc-400 font-normal">(optional, ₹)</span>
          </label>
          <input
            {...register("salaryMin")}
            type="number"
            min={0}
            placeholder="e.g. 800000"
            className={inputClass(false)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Salary Max <span className="text-zinc-400 font-normal">(optional, ₹)</span>
          </label>
          <input
            {...register("salaryMax")}
            type="number"
            min={0}
            placeholder="e.g. 1200000"
            className={inputClass(false)}
          />
        </div>
      </div>

      {/* ── Row: Location & Status ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <select {...register("location")} className={inputClass(false)}>
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Status
          </label>
          <div className="flex items-center h-10">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20">
              Applied
            </span>
            <p className="ml-3 text-xs text-zinc-400">
              Set automatically on creation
            </p>
          </div>
        </div>
      </div>

      {/* ── Notes ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notes / Remarks <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register("notes")}
          rows={4}
          placeholder="Any extra notes, recruiter contact details, referral info..."
          className={`${inputClass(false)} resize-none`}
        />
      </div>

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 dark:bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Application"}
        </button>
      </div>
    </form>
  );
}

// ─── Shared input class helper ────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50",
    "bg-white dark:bg-zinc-800",
    "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
    "focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300",
    "transition-colors",
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-zinc-200 dark:border-zinc-700",
  ].join(" ");
}
