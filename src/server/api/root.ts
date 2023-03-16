import { serverRouter } from "./routers/servers";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";
import { miscRouter } from "./routers/misc";
import { websocketRouter } from "./routers/websocket";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  server: serverRouter,
  misc: miscRouter,
  websocket: websocketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
