import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/db";

/**
 * Zod schema for creating a new job application.
 * Mirrors the Application model in prisma/schema.prisma.
 */
const createApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().optional(),
  dateApplied: z.string().optional(), // ISO date string from the date input
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const applicationsRouter = router({
  /**
   * Create a new job application for the authenticated user.
   * Handles URL sanitization and duplicate detection.
   */
  create: protectedProcedure
    .input(createApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      // Resolve local User record from Kinde ID
      // ctx.user.id is the Kinde ID — we need our local User.id (cuid)
      const dbUser = await prisma.user.findUnique({
        where: { kindeId: ctx.user.id },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User account not found. Please log out and log in again.",
        });
      }

      // Sanitize Job URL: auto-prepend https:// if user omitted protocol
      let jobUrl = input.jobUrl?.trim() || undefined;
      if (jobUrl && !jobUrl.startsWith("http://") && !jobUrl.startsWith("https://")) {
        jobUrl = `https://${jobUrl}`;
      }

      try {
        const application = await prisma.application.create({
          data: {
            userId: dbUser.id, // ← local cuid, not Kinde ID
            companyName: input.companyName.trim(),
            jobTitle: input.jobTitle.trim(),
            jobUrl,
            dateApplied: input.dateApplied
              ? new Date(input.dateApplied)
              : new Date(),
            salaryMin: input.salaryMin ?? null,
            salaryMax: input.salaryMax ?? null,
            location: input.location || null,
            notes: input.notes?.trim() || null,
          },
        });

        return application;
      } catch (error: any) {
        // Prisma unique constraint violation → duplicate application
        if (error?.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "You have already applied for this role at this company.",
          });
        }
        // Log unexpected errors and surface a safe message
        console.error("[applications.create]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again.",
        });
      }
    }),
});
