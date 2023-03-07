import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        servers: true,
        adminships: true,
        memberships: true,
      },
    });
  }),
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
  setUserName: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: { name: input },
      });
    }),
  setUserPsuedonym: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      console.log(input);
      const userId = ctx.session.user.id;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: { pseudonym: input },
      });
    }),
  setUserImage: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user;
      if (user.image == `https://weaveimages.s3.amazonaws.com/${input}`) {
        return;
      } else {
        return ctx.prisma.user.update({
          where: { id: user.id },
          data: { image: `https://weaveimages.s3.amazonaws.com/${input}` },
        });
      }
    }),
  setUserPsuedonymImage: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: {
          pseudonym_image: `https://weaveimages.s3.amazonaws.com/${input}`,
        },
      });
    }),
  userCheck: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        email: input,
      },
    });
  }),
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const res = await ctx.prisma.user.update({ where: { id: userId }, data: { name: null, pseudonym: null, email: null } });
    console.log(res);
  }),
});
