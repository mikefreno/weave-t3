import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { User, type Server } from "@prisma/client";
import * as SibApiV3Sdk from "@sendinblue/client";

export const serverRouter = createTRPCRouter({
  createServer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        blurb: z.string().optional(),
        category: z.string().optional(),
        public: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.server.create({
        data: {
          name: input.name,
          blurb: input.blurb ? input.blurb : null,
          category: input.category ? input.category : undefined,
          public: input.public,
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
      const apiUrl = "https://api.brevo.com/v3/smtp/email";

      const sendinblueData = {
        sender: {
          name: "Weave Server Invite",
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
  getPublicServersByCategory: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.server.findMany({
      where: {
        public: true,
        category: input,
      },
    });
  }),
  getAllPublicServers: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.server.findMany({ where: { public: true } });
  }),
  postComment: protectedProcedure
    .input(
      z.object({
        channelID: z.number(),
        commentContent: z.string(),
        serverID: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userID = ctx.session.user.id;
      const serverData = await ctx.prisma.server.findFirst({
        where: { id: input.serverID },
      });
      if (serverData) {
        const reactionKeys = serverData.emojiReactions?.split(",");
        const reactionInit: { [key: string]: number } = {};
        reactionKeys?.forEach((reaction) => {
          reactionInit[reaction] = 0;
        });
        return await ctx.prisma.comment.create({
          data: {
            userId: userID,
            message: input.commentContent,
            channelID: input.channelID,
            reactions: reactionInit,
          },
        });
      }
    }),
  getChannelComments: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    if (input === 0) {
      return "";
    } else {
      const channelComments = await ctx.prisma.comment.findMany({
        where: { channelID: input },
        include: {
          reactions: true,
          user: true,
        },
      });
      return channelComments;
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
  getPrivilegeBasedServerData: protectedProcedure
    .input(z.object({ serverID: z.number().optional(), privilegeLevel: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (input.privilegeLevel === "admin" || input.privilegeLevel === "owner") {
        const fullServerData = await ctx.prisma.server.findFirst({
          where: {
            id: input.serverID,
          },
          include: {
            owner: true,
            admin: { include: { admin: true } },
            members: { include: { member: true } },
            bannedMembers: { include: { member: true } },
            suspendedMembers: { include: { member: true } },
          },
        });
        return fullServerData;
      } else {
        const restrictedServerData = await ctx.prisma.server.findFirst({
          where: {
            id: input.serverID,
          },
        });
        return restrictedServerData;
      }
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
            admin: {
              connect: { id: input.promoteeID },
            },
            Server: {
              connect: { id: input.serverID },
            },
            joinedAt: memberData.joinedAt,
            invitedBy: memberData.invitedBy,
            assignedBy: input.promoterID,
          },
        });
        await ctx.prisma.server_Member.delete({
          where: {
            id: memberData.id,
          },
        });
      }
    }),
  demoteAdminToMember: protectedProcedure
    .input(z.object({ demoteeID: z.string(), demoterID: z.string(), serverID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const adminData = await ctx.prisma.server_Admin.findFirst({
        where: {
          adminId: input.demoteeID,
          ServerId: input.serverID,
        },
      });
      if (adminData) {
        await ctx.prisma.server_Member.create({
          data: {
            member: {
              connect: { id: input.demoteeID },
            },
            Server: {
              connect: { id: input.serverID },
            },
            joinedAt: adminData.joinedAt,
            invitedBy: adminData.invitedBy,
          },
        });
        await ctx.prisma.server_Admin.delete({
          where: {
            id: adminData.id,
          },
        });
      }
    }),
  setServerEmojis: protectedProcedure
    .input(z.object({ serverID: z.number(), emojiString: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.server.update({
          where: {
            id: input.serverID,
          },
          data: {
            emojiReactions: input.emojiString,
          },
        });
        return "success";
      } catch (e) {
        console.log(e);
        return "error";
      }
    }),
  globalInitReaction: protectedProcedure.query(async ({ ctx }) => {
    const all_servers = await ctx.prisma.server.findMany({
      include: {
        channels: { include: { comments: true } },
      },
    });
    let serversReactionKeys: string[] = [];

    all_servers.forEach((server) => {
      if (server.emojiReactions) {
        serversReactionKeys = server.emojiReactions.split(",");
        const serversReactionInit: { [key: string]: number } = {};
        serversReactionKeys.forEach((reaction) => {
          serversReactionInit[reaction] = 0;
        });
        server.channels.forEach((channel) =>
          channel.comments.forEach(
            async (comment) =>
              await ctx.prisma.comment.update({ where: { id: comment.id }, data: { reactions: serversReactionInit } })
          )
        );
      }
    });
  }),
  commentReactionGiven: protectedProcedure
    .input(z.object({ commentID: z.number(), reaction: z.string(), reactingUserID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const reaction = await ctx.prisma.reaction.findFirst({
          where: { commentID: input.commentID, type: input.reaction },
        });
        if (reaction) {
          const usersWhoGaveReaction = reaction.reactingUsers.split(",");
          console.log("usersWhoGaveReaction: " + usersWhoGaveReaction);
          if (usersWhoGaveReaction && usersWhoGaveReaction.includes(input.reactingUserID)) {
            const otherUsers = usersWhoGaveReaction.filter((userID) => userID !== input.reactingUserID);
            const usersString = otherUsers.join(",");
            await ctx.prisma.reaction.update({
              where: { id: reaction.id },
              data: { count: reaction.count - 1, reactingUsers: usersString },
            });
          } else {
            const usersString = reaction.reactingUsers + input.reactingUserID + ",";
            await ctx.prisma.reaction.update({
              where: { id: reaction.id },
              data: { count: reaction.count + 1, reactingUsers: usersString },
            });
          }
        } else {
          await ctx.prisma.reaction.create({
            data: {
              commentID: input.commentID,
              type: input.reaction,
              count: 1,
              reactingUsers: input.reactingUserID + ",",
            },
          });
        }
        return "success";
      } catch (e) {
        console.log(e);
        return "error";
      }
    }),
  banUser: protectedProcedure
    .input(z.object({ userIDtoBan: z.string(), serverID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const found = await ctx.prisma.banned_Member.findFirst({
        where: {
          memberId: input.userIDtoBan,
          ServerId: input.serverID,
        },
      });
      if (found) {
        return "exists error";
      } else {
        const userToBan = await ctx.prisma.server_Member.findFirst({
          where: {
            memberId: input.userIDtoBan,
            ServerId: input.serverID,
          },
        });
        try {
          if (userToBan) {
            const found = ctx.prisma.banned_Member.findFirst({
              where: {
                memberId: input.userIDtoBan,
              },
            });
            await ctx.prisma.banned_Member.create({
              data: {
                memberId: input.userIDtoBan,
                ServerId: input.serverID,
                bannedById: ctx.session.user.id,
                invitedBy: userToBan.invitedBy,
                joinedAt: userToBan.joinedAt,
              },
            });
            await ctx.prisma.server_Member.delete({
              where: {
                id: userToBan.id,
              },
            });
            return "success";
          }
        } catch (e) {
          console.error(e);
          return "error";
        }
      }
    }),
  unBanUser: protectedProcedure
    .input(z.object({ userIDtoUnBan: z.string(), serverID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const found = await ctx.prisma.server_Member.findFirst({
        where: {
          memberId: input.userIDtoUnBan,
          ServerId: input.serverID,
        },
      });
      if (found) {
        return "exists error";
      } else {
        const userToUnBan = await ctx.prisma.banned_Member.findFirst({
          where: {
            memberId: input.userIDtoUnBan,
            ServerId: input.serverID,
          },
        });
        try {
          if (userToUnBan) {
            await ctx.prisma.server_Member.create({
              data: {
                memberId: input.userIDtoUnBan,
                ServerId: input.serverID,
                invitedBy: userToUnBan.invitedBy,
                joinedAt: userToUnBan.joinedAt,
              },
            });
            await ctx.prisma.banned_Member.delete({
              where: {
                id: userToUnBan.id,
              },
            });
            return "success";
          }
        } catch (e) {
          console.error(e);
          return "error";
        }
      }
    }),
});
