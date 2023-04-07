import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { User, WSConnection } from "@prisma/client";

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
  joinOrLeaveCall: protectedProcedure
    .input(z.object({ newState: z.boolean(), channelID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.wSConnection.updateMany({
        where: { userId: ctx.session.user.id },
        data: {
          inCall: input.newState,
          channelID: input.channelID,
        },
      });
      const connection = await ctx.prisma.wSConnection.findFirst({
        where: { userId: ctx.session.user.id },
      });
      if (connection && connection.channelID) {
        const thisChannel = await ctx.prisma.server_Channel.findFirst({
          where: { id: connection.channelID },
        });
        if (thisChannel && input.newState === true) {
          const newConnectionString = thisChannel.connections
            ? thisChannel.connections + connection.connectionID + ","
            : connection.connectionID + ",";
          await ctx.prisma.server_Channel.update({
            where: { id: connection.channelID },
            data: {
              connections: newConnectionString,
            },
          });
        }
        if (thisChannel && input.newState === false) {
          let newConnectionString;
          if (thisChannel.connections === connection.connectionID) {
            newConnectionString = null;
          } else {
            newConnectionString = thisChannel.connections?.replace(
              connection.connectionID + ",",
              ""
            );
          }
          await ctx.prisma.server_Channel.update({
            where: { id: connection.channelID },
            data: {
              connections: newConnectionString,
            },
          });
        }
      }
    }),
  // getSocketState: protectedProcedure.input().query(),
  wssConnectedToChannel: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const connections = await ctx.prisma.wSConnection.findMany({
        where: {
          channelID: input,
          NOT: {
            user: null,
            userId: null,
          },
        },
        include: { user: true },
      });

      return connections as (WSConnection & {
        user: User;
      })[];
    }),
});
