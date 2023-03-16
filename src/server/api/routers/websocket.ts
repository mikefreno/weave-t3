import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import S3 from "aws-sdk/clients/s3";

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
});
