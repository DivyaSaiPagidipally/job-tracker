import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/index";

/**
 * Typed tRPC React client.
 * Import this in client components to call tRPC mutations and queries.
 * e.g. const { mutate } = trpc.application.create.useMutation()
 */
export const trpc = createTRPCReact<AppRouter>();
