import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const serverRouter = createTRPCRouter({
  createServer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        blurb: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const thisServer = await ctx.prisma.server.create({
        data: {
          name: input.name,
          blurb: input.blurb ? input.blurb : null,
          category: input.category,
          ownerId: ctx.session.user.id,
        },
      });
      return;
    }),
  updateServerLogo: protectedProcedure
    .input(z.object({ serverID: z.number(), url: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.server.update({
        where: { id: input.serverID },
        data: {
          logo_url: `https://weaveimages.s3.amazonaws.com/${input.url}`,
        },
      });
    }),
  updateServerBanner: protectedProcedure
    .input(z.object({ serverID: z.number(), url: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.server.update({
        where: { id: input.serverID },
        data: {
          banner_url: `https://weaveimages.s3.amazonaws.com/${input.url}`,
        },
      });
    }),
  getAllServers: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.server.findMany({
        select: {
          name: true,
          blurb: true,
          logo_url: true,
          banner_url: true,
          category: true,
        },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
});
