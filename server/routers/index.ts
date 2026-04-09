import { router } from "../trpc";
import { applicationsRouter } from "./applications";

/**
 * Root application router.
 * All feature sub-routers are merged here.
 */
export const appRouter = router({
  application: applicationsRouter,
});

export type AppRouter = typeof appRouter;
