import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const serverManageRouter = () => {
  createServer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        blurb: z.string(),
        logo_url: z.string(),
        banner_url: z.string(),
        category: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.server.create({
          data: {
            name: input.name,
            blurb: input.blurb,
            logo_url: input.logo_url,
            banner_url: input.banner_url,
            category: input.category,
            ownerId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
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
  });
};
