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
      return filteredUsers;
    } else {
      return null;
    }
  }),
  getPublicMongoServer: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prismaMongo.server.findMany({
      where: {
        public: true,
      },
    });
  }),
});
