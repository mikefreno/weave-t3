import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface MongoUser {
  id: string;
  name: string | null;
  pseudonym: string | null;
  email: string | null;
}
interface MongoServer {
  id: number;
  name: string | null;
}

export const databaseMgmtRouter = createTRPCRouter({
  syncAllMongoUsers: protectedProcedure.mutation(async ({ ctx }) => {
    if (
      ctx.session.user.id === "cle6jo913000tofj4e2zijrnk" ||
      ctx.session.user.id === "cle4jdgkz0007of5cyqlqtfey"
    ) {
      try {
        const all_users = await ctx.prisma.user.findMany();
        const mongoUsers: MongoUser[] = await ctx.prismaMongo.user.findMany();
        const mongoUsersMap = new Map(
          mongoUsers.map((user) => [user.id, user])
        );

        // Filter users not yet in MongoDB and add new users
        const usersNotInMongo = all_users.filter(
          (user) => !mongoUsersMap.has(user.id)
        );
        await Promise.all(
          usersNotInMongo.map(
            async (user) =>
              await ctx.prismaMongo.user.create({
                data: {
                  id: user.id,
                  name: user.name,
                  pseudonym: user.pseudonym,
                  email: user.email,
                },
              })
          )
        );
        await Promise.all(
          all_users.map(async (user) => {
            const mongoUser = mongoUsersMap.get(user.id);

            if (
              mongoUser &&
              (mongoUser.name !== user.name ||
                mongoUser.pseudonym !== user.pseudonym)
            ) {
              await ctx.prismaMongo.user.update({
                where: { id: user.id },
                data: {
                  name: user.name,
                  pseudonym: user.pseudonym,
                },
              });
            }
          })
        );
        return { message: "success" };
      } catch (err) {
        return { message: err };
      }
    } else {
      return { message: "refused" };
    }
  }),
  syncAllMongoServers: protectedProcedure.mutation(async ({ ctx }) => {
    if (
      ctx.session.user.id === "cle6jo913000tofj4e2zijrnk" ||
      ctx.session.user.id === "cle4jdgkz0007of5cyqlqtfey"
    ) {
      try {
        const all_servers = await ctx.prisma.server.findMany();
        const mongoServers: MongoServer[] =
          await ctx.prismaMongo.server.findMany();
        const mongoServerMap = new Map(
          mongoServers.map((server) => [server.id, server])
        );
        const serversNotInMongo = all_servers.filter(
          (server) => !mongoServerMap.has(server.id)
        );
        await Promise.all(
          serversNotInMongo.map(
            async (server) =>
              await ctx.prismaMongo.server.create({
                data: {
                  id: server.id,
                  name: server.name,
                },
              })
          )
        );
        await Promise.all(
          all_servers.map(async (server) => {
            const mongoServer = mongoServerMap.get(server.id);

            if (mongoServer && mongoServer.name !== server.name) {
              await ctx.prismaMongo.server.update({
                where: { id: server.id },
                data: {
                  name: server.name,
                },
              });
            }
          })
        );
        return { message: "success" };
      } catch (err) {
        return { message: err };
      }
    } else {
      return { message: "refused" };
    }
  }),
});
