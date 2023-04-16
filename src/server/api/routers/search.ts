import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface MongoUser {
  id: string;
  name: string | null;
  pseudonym: string | null;
  email: string | null;
}

export const searchRouter = createTRPCRouter({
  getMongoUsers: protectedProcedure.mutation(async ({ ctx }) => {
    const userData: MongoUser[] | null = await ctx.prismaMongo.user.findMany();
    if (userData) {
      const filteredUsers = userData.filter((user) => user.id !== user.email);
      const mongoUsersMap = new Map(
        filteredUsers.map((user) => [user, user.id])
      );
      return mongoUsersMap;
    } else {
      return null;
    }
  }),
  getMongoServer: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prismaMongo.user.findMany();
  }),
});
