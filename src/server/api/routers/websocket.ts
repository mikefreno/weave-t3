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
    }),
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
