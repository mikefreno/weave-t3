import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import SibApiV3Sdk from "@sendinblue/client";

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
      return await ctx.prisma.server.create({
        data: {
          name: input.name,
          blurb: input.blurb ? input.blurb : null,
          category: input.category,
          ownerId: ctx.session.user.id,
        },
      });
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
  getAllServers: publicProcedure.query(async ({ ctx }) => {
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
  getServerByID: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.server.findFirst({
        where: {
          id: input,
        },
      });
    }),
  createJWTInvite: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userID,
        },
        include: {
          servers: true,
          adminships: true,
          memberships: true,
        },
      });
      if (user == null) {
        return;
      } else {
        const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
        const payload = {
          input,
          exp: expiry,
        };
        const SK = process.env.JWT_SECRET;
        const token = jwt.sign(payload, SK!);

        user.servers.map((server) => {
          if (server.id === input) {
            return { token };
          }
        });
        user.adminships.map((admin) => {
          if (admin.ServerId === input) {
            return { token };
          }
        });
        user.memberships.map((membership) => {
          if (membership.ServerId === input) {
            return { token };
          }
        });
      }
    }),
  sendServerInvite: protectedProcedure
    .input(
      z.object({
        invitee: z.string(),
        serverName: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const apiInstance = new SibApiV3Sdk.AccountApi();
      apiInstance.setApiKey(
        SibApiV3Sdk.AccountApiApiKeys.apiKey,
        process.env.SENDINBLUE_KEY!
      );

      const sendSmtpEmail = {
        to: [
          {
            email: input.invitee,
          },
        ],
        params: {
          SERVER: input.serverName,
          TOKEN: input.token,
        },
        templateId: 7,
      };
    }),
  // checkServerInvite: protectedProcedure
});
