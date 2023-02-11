import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// const storage_image = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `uploads/users/profile_images`);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });
// const upload_image = multer({ storage: storage_image });

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.user.findFirst({
      where: {
        id: userId,
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
      const userId = ctx.session.user.id;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: { psuedonym: input },
      });
    }),
  setUserImage: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.user.update({
        where: { id: userId },
        data: { image: `https://weaveimages.s3.amazonaws.com/${input}` },
      });
    }),
  setUserPsuedonymImage: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.user.update({
        where: { id: userId },
        data: {
          psuedonym_image: `https://weaveimages.s3.amazonaws.com/${input}`,
        },
      });
    }),
});
