import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/index";
import { createTRPCContext } from "@/server/trpc";

/**
 * Next.js App Router handler for tRPC.
 * All tRPC client calls hit this single endpoint.
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
