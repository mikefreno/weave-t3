import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { Server } from "@prisma/client";

export const serverRouter = createTRPCRouter({
  createServer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        blurb: z.string().optional(),
        category: z.string().optional(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.server.create({
        data: {
          name: input.name,
          blurb: input.blurb ? input.blurb : null,
          category: input.category ? input.category : undefined,
          type: input.type,
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
  getAllCurrentUserServers: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      include: {
        servers: { include: { channels: true } },
        adminships: { include: { Server: { include: { channels: true } } } },
        memberships: { include: { Server: { include: { channels: true } } } },
      },
    });
    let allServers: Server[] = [];
    if (user !== null) {
      const adminServers = user.adminships.map((adminship) => adminship.Server);
      const memberServers = user.memberships.map(
        (membership) => membership.Server
      );
      const servers = [
        ...new Set([...adminServers, ...memberServers, ...user.servers]),
      ];
      allServers.push(...servers);
      return allServers;
    }
  }),
  getServerByID: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const server = await ctx.prisma.server.findFirst({
        where: {
          id: input,
        },
      });
    }),
  createJWTInvite: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const SK = process.env.JWT_SECRET!;
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          data: { server: input, inviter: userID },
        },
        SK
      );
      return token;
    }),
  sendServerInvite: protectedProcedure
    .input(
      z.object({
        invitee: z.string(),
        serverName: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      var SibApiV3Sdk = require("sib-api-v3-sdk");

      let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

      let apiKey = apiInstance.authentications["apiKey"];
      apiKey.apiKey = process.env.SENDINBLUE_KEY;

      apiInstance.sendTransacEmail({
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
      });
    }),
  createServerChannel: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        serverType: z.string(),
        description: z.string().optional(),
        serverID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.server_Channel.create({
        data: {
          name: input.name,
          description: input.description ? input.description : null,
          ServerId: input.serverID,
          type: input.serverType,
        },
      });
      if (channel) {
        return true;
      }
    }),
  getAllPublicServers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.server.findMany({
      where: {
        type: "public",
      },
    });
  }),
});
