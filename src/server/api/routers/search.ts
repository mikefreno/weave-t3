import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface MongoUser {
  id: string;
  name: string | null;
  pseudonym: string | null;
}

export const searchRouter = createTRPCRouter({
  getMongoUsers: protectedProcedure.mutation(async ({ ctx }) => {
    const userData: MongoUser[] | null = await ctx.prismaMongo.user.findMany();
    if (userData) {
      const mongoUsersMap = new Map(userData.map((user) => [user, user.id]));
      return mongoUsersMap;
    } else {
      return null;
    }
  }),
  getMongoServer: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prismaMongo.user.findMany();
  }),
});
