import { initTRPC, TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Build tRPC context from Kinde session.
 * Called on every request to inject the authenticated user.
 */
export async function createTRPCContext() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return { user };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure — throws UNAUTHORIZED if the caller is not logged in.
 * All application mutations must use this.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { user: ctx.user } });
});
