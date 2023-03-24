import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    if (ctx.session && ctx.session.user) {
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
    }
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
  setUserPseudonym: protectedProcedure
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
  setUserPseudonymImage: protectedProcedure
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
  setGravatarAsImage: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: {
          image: input,
          pseudonym_image: input,
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
    const res = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        name: "User Deleted",
        pseudonym: "User Deleted",
        email: null,
        emailVerified: null,
        registered_at: null,
        image: null,
        pseudonym_image: null,
        provider: null,
        refresh_token: null,
        access_token: null,
        token_expiration: null,
        type: undefined,
        real_name_use: "",
        name_display_pref: "",
        bio: null,
      },
    });
    const account = await ctx.prisma.account.findFirst({
      where: { userId: userId },
    });
    if (account) {
      const res2 = await ctx.prisma.account.update({
        where: { id: account.id },
        data: {
          providerAccountId: "",
          provider: "",
          access_token: null,
          token_type: null,
          id_token: null,
          scope: null,
        },
      });
      console.log("ACCOUNT EFFECT: ", res2);
    }
    console.log("USER EFFECT: ", res);
  }),
});
