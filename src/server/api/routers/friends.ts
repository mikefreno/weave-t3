import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendsRouter = createTRPCRouter({
  sendFriendRequest: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    try {
      const newFriendRequest = await ctx.prisma.friend_Request.create({
        data: {
          senderID: ctx.session.user.id,
          targetID: input,
        },
      });
      await ctx.prisma.friend_Request_junction.create({
        data: {
          user: {
            connect: {
              id: input,
            },
          },
          friendRequest: {
            connect: {
              id: newFriendRequest.id,
            },
          },
        },
      });
      await ctx.prisma.friend_Request_junction.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          friendRequest: {
            connect: {
              id: newFriendRequest.id,
            },
          },
        },
      });
      return "success";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }),
  acceptFriendRequest: protectedProcedure
    .input(z.object({ requestID: z.number(), senderID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newFriendship = await ctx.prisma.friendship.create({
        data: {},
      });
      await ctx.prisma.friendship_junction.create({
        data: {
          user: {
            connect: {
              id: input.senderID,
            },
          },
          friendID: ctx.session.user.id,
          friendship: {
            connect: {
              id: newFriendship.id,
            },
          },
        },
      });
      await ctx.prisma.friendship_junction.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          friendID: input.senderID,
          friendship: {
            connect: {
              id: newFriendship.id,
            },
          },
        },
      });
      await ctx.prisma.friend_Request.delete({
        where: {
          id: input.requestID,
        },
      });
    }),
  deleteFriendRequest: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.friend_Request.delete({
        where: {
          id: input,
        },
      });
      return "success";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }),
  ignoreFriendRequest: protectedProcedure
    .input(z.object({ requestID: z.number(), targetBoolean: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.friend_Request.update({
          where: {
            id: input.requestID,
          },
          data: {
            ignored: input.targetBoolean,
          },
        });
        return "success";
      } catch (e) {
        console.error(e);
        return "error";
      }
    }),
  checkFriendState: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const check = await ctx.prisma.friendship_junction.findFirst({
      where: {
        userID: input,
        friendID: ctx.session.user.id,
      },
    });
    if (check) {
      return true;
    }
    return false;
  }),
  checkFriendRequestState: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const check = await ctx.prisma.friend_Request.findFirst({
      where: {
        senderID: input,
        targetID: ctx.session.user.id,
      },
    });
    if (check) {
      return true;
    } else {
      const check2 = await ctx.prisma.friend_Request.findFirst({
        where: {
          targetID: input,
          senderID: ctx.session.user.id,
        },
      });
      if (check2) {
        return true;
      }
      return false;
    }
  }),
});
