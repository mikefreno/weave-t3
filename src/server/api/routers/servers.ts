import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { User, type Server } from "@prisma/client";

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
    const allServers: Server[] = [];
    if (user !== null) {
      const adminServers = user.adminships.map((adminship) => adminship.Server);
      const memberServers = user.memberships.map((membership) => membership.Server);
      const servers = [...new Set([...adminServers, ...memberServers, ...user.servers])];
      allServers.push(...servers);
      const filteredServers = allServers.filter((server) => server.unlisted === false);
      return filteredServers;
    }
  }),
  getServerByID: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const server = await ctx.prisma.server.findFirst({
      where: {
        id: input,
      },
    });
    return server;
  }),
  createJWTInvite: protectedProcedure
    .input(z.object({ serverID: z.number(), email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const SK = process.env.JWT_SECRET as string;
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          data: { server: input.serverID, inviter: userID, email: input.email },
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
      const apiKey = process.env.SENDINBLUE_KEY as string;
      const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

      const sendinblueData = {
        sender: {
          name: "Weave Website Contact",
          email: "no_reply@weavechat.net",
        },
        to: [
          {
            email: input.invitee,
          },
        ],
        templateId: 7,
        params: {
          SERVER: input.serverName,
          TOKEN: input.token,
          SOURCE_URL: process.env.NEXT_PUBLIC_HOSTNAME,
        },
        subject: `Invitation to join ${input.serverName}`,
      };
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(sendinblueData),
      });
    }),
  checkForMemberEmail: protectedProcedure
    .input(z.object({ email: z.string(), serverID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const server = await ctx.prisma.server.findFirst({
        where: {
          id: input.serverID,
        },
        include: {
          owner: true,
          admin: { include: { admin: true } },
          members: { include: { member: true } },
        },
      });
      if (server !== null) {
        const adminEmails = server.admin.map((admin) => admin.admin.email);
        const memberEmails = server.members.map((member) => member.member.email);
        const emails = [...new Set([...adminEmails, ...memberEmails, server.owner.email])];
        if (emails.includes(input.email)) {
          return true;
        } else return false;
      }
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
  getAllPublicServers: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.server.findMany({
      where: {
        type: "public",
        category: input,
      },
    });
  }),
  postComment: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/api/send-message" } })
    .input(
      z.object({
        channelID: z.number(),
        commentContent: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userID = ctx.session.user.id;
      return await ctx.prisma.comment.create({
        data: {
          userId: userID,
          message: input.commentContent,
          channelID: input.channelID,
        },
      });
    }),
  getChannelComments: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    if (input === 0) {
      return "";
    } else {
      return ctx.prisma.comment.findMany({
        where: { channelID: input },
        include: {
          user: true,
        },
      });
    }
  }),
  deleteUserFromServer: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const userID = ctx.session.user.id;

    const serverMember = await ctx.prisma.server_Member.findFirst({
      where: {
        memberId: userID,
        ServerId: input,
      },
    });
    if (serverMember) {
      await ctx.prisma.server_Member.delete({
        where: { id: serverMember.id },
      });
    }
    const serverAdmin = await ctx.prisma.server_Admin.findFirst({
      where: {
        adminId: userID,
        ServerId: input,
      },
    });
    if (serverAdmin) {
      await ctx.prisma.server_Member.delete({
        where: { id: serverAdmin.id },
      });
    }
  }),
  joinPublicServer: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const userID = ctx.session.user.id;
    const member = await ctx.prisma.server_Member.findFirst({
      where: { memberId: userID, ServerId: input },
    });
    const admin = await ctx.prisma.server_Admin.findFirst({
      where: { adminId: userID, ServerId: input },
    });
    const server = await ctx.prisma.server.findFirst({
      where: { id: input },
    });
    let owner: boolean;
    if (userID == server?.ownerId) {
      owner = true;
    } else {
      owner = false;
    }
    if (member || admin || owner) {
      return false;
    } else {
      await ctx.prisma.server_Member.create({
        data: {
          member: {
            connect: { id: userID },
          },
          Server: {
            connect: { id: input },
          },
          invitedBy: "publicJoin",
        },
      });
    }
  }),
  getFullServerData: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const serverMemberData = await ctx.prisma.server.findFirst({
      where: {
        id: input,
      },
      include: {
        owner: true,
        admin: { include: { admin: true } },
        members: { include: { member: true } },
      },
    });
    return serverMemberData;
  }),
  getUsersInChannel: protectedProcedure.input(z.number()).query(async ({ input, ctx }): Promise<User[]> => {
    const wsConnections = await ctx.prisma.wSConnection.findMany({
      where: {
        channelID: input,
      },
      include: {
        user: true,
      },
    });
    const Users = wsConnections.map((wsConnection) => {
      return wsConnection.user ?? null;
    });
    return Users.filter(Boolean) as User[];
  }),
  getUserPrivilegeLevel: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const userID = ctx.session.user.id;
    const serverData = await ctx.prisma.server.findFirst({
      where: {
        id: input,
      },
      include: { admin: true },
    });
    if (serverData) {
      if (userID === serverData.ownerId) {
        return "owner";
      } else {
        const adminCheck = serverData.admin.find((admin) => admin.adminId === userID);
        return adminCheck ? "admin" : "member";
      }
    }
  }),
  delistServer: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const userID = ctx.session.user.id;
    const serverData = await ctx.prisma.server.findFirst({
      where: { id: input },
    });
    if (serverData && userID === serverData.ownerId) {
      await ctx.prisma.server.update({
        where: { id: input },
        data: {
          unlisted: true,
        },
      });
      return "Server unlisted and queued for deletion, contact support immediately if in error: mike@weavechat.net";
    } else return "Rejected";
  }),
  deleteUnlistedServer: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const userID = ctx.session.user.id;
    if (
      userID === "cle4jdgkz0007of5cyqlqtfey" ||
      userID === "cle6jo913000tofj4e2zijrnk" ||
      userID === "clgzqfm7l0000of4z4fragl8f"
    ) {
      const serverData = await ctx.prisma.server.findFirst({
        where: { id: input },
      });
      if (serverData && serverData.unlisted) {
        await ctx.prisma.server.delete({
          where: { id: input },
        });
      }
    }
  }),
  getUnlistedServers: protectedProcedure.query(async ({ ctx }) => {
    const userID = ctx.session.user.id;
    if (
      userID === "cle4jdgkz0007of5cyqlqtfey" ||
      userID === "cle6jo913000tofj4e2zijrnk" ||
      userID === "clgzqfm7l0000of4z4fragl8f"
    ) {
      const unlistedServers = await ctx.prisma.server.findMany({
        where: {
          unlisted: true,
        },
        include: {
          owner: true,
        },
      });
      return unlistedServers;
    }
  }),
  promoteMemberToAdmin: protectedProcedure
    .input(z.object({ promoteeID: z.string(), promoterID: z.string(), serverID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const memberData = await ctx.prisma.server_Member.findFirst({
        where: {
          memberId: input.promoteeID,
          ServerId: input.serverID,
        },
      });
      if (memberData) {
        await ctx.prisma.server_Admin.create({
          data: {
            adminId: memberData.memberId,
            ServerId: input.serverID,
            assignedBy: input.promoterID,
            joinedAt: memberData.joinedAt,
            invitedBy: memberData.invitedBy,
          },
        });
      }
    }),
});
