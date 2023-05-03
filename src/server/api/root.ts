import { serverRouter } from "./routers/servers";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";
import { miscRouter } from "./routers/misc";
import { websocketRouter } from "./routers/websocket";
import { databaseMgmtRouter } from "./routers/databaseMgmt";
import { searchRouter } from "./routers/search";
import { conversationRouter } from "./routers/conversation";
import { friendsRouter } from "./routers/friends";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  conversation: conversationRouter,
  databaseMgmt: databaseMgmtRouter,
  friends: friendsRouter,
  misc: miscRouter,
  search: searchRouter,
  server: serverRouter,
  users: userRouter,
  websocket: websocketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
