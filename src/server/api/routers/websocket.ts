import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import S3 from "aws-sdk/clients/s3";
import { User } from "@prisma/client";

export const websocketRouter = createTRPCRouter({
  disconnectWsFromChannel: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.wSConnection.updateMany({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        channelID: 0,
      },
    });
  }),
  updateWs: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.wSConnection.updateMany({
        where: { userId: ctx.session.user.id },
        data: {
          channelID: input,
        },
      });
    }),
  joinOrLeaveCall: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.wSConnection.updateMany({
        where: { userId: ctx.session.user.id },
        data: {
          inCall: input,
        },
      });
    }),
  usersInCall: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const connections = await ctx.prisma.wSConnection.findMany({
        where: { inCall: true, channelID: input },
        include: { user: true },
      });
      if (connections && connections.length > 0) {
        const users = connections
          .map((connection) => connection.user)
          .filter((user): user is User => user !== undefined);
        return users;
      } else {
        return "No users in call";
      }
    }),
});
