import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationRouter = createTRPCRouter({
  createConversation: protectedProcedure
    .input(z.object({ message: z.string(), targetUserID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const newConversation = await ctx.prisma.conversation.create({
          data: {
            initiatorID: ctx.session.user.id,
          },
        });
        await ctx.prisma.directMessage.create({
          data: {
            message: input.message,
            senderID: ctx.session.user.id,
            conversationID: newConversation.id,
          },
        });
        await ctx.prisma.conversation_junction.create({
          data: {
            user: {
              connect: {
                id: input.targetUserID,
              },
            },
            conversation: {
              connect: {
                id: newConversation.id,
              },
            },
          },
        });
        await ctx.prisma.conversation_junction.create({
          data: {
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            conversation: {
              connect: {
                id: newConversation.id,
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
  acceptConversation: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.conversation.update({
        where: {
          id: input,
        },
        data: {
          accepted: true,
          ignored: false,
        },
      });
      return "success";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }),
  ignoreConversation: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.conversation.update({
        where: {
          id: input,
        },
        data: {
          ignored: true,
        },
      });
      return "success";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }),
  deleteConversation: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.conversation.delete({
        where: {
          id: input,
        },
      });
    } catch (e) {
      console.error(e);
      return "error";
    }
  }),
  createDirectMessage: protectedProcedure
    .input(z.object({ message: z.string(), conversationID: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.directMessage.create({
        data: {
          message: input.message,
          senderID: ctx.session.user.id,
          conversationID: input.conversationID,
        },
      });
    }),
  getUsersConversations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        conversation_junction: {
          include: {
            conversation: { include: { directMessage: true, conversation_junction: { include: { user: true } } } },
          },
        },
      },
    });
  }),
  getConversation: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const requestedConversation = await ctx.prisma.conversation.findUnique({
      where: {
        id: input,
      },
      include: {
        directMessage: { include: { reactions: true } },
        conversation_junction: { include: { user: true } },
      },
    });
    return requestedConversation;
  }),
  getDirectMessages: protectedProcedure.input(z.number().nullish()).query(async ({ ctx, input }) => {
    if (input) {
      const dms = await ctx.prisma.directMessage.findMany({
        where: {
          conversationID: input,
        },
        include: {
          reactions: true,
        },
      });
      return dms;
    }
    return "no input";
  }),
  directMessageGiveReaction: protectedProcedure
    .input(z.object({ dmID: z.number(), reaction: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const reaction = await ctx.prisma.reaction.findFirst({
          where: { directMessageId: input.dmID, type: input.reaction },
        });
        if (reaction) {
          await ctx.prisma.reaction.update({
            where: { id: reaction.id },
            data: { count: reaction.count - 1, reactingUsers: "" },
          });
        } else {
          await ctx.prisma.reaction.create({
            data: {
              directMessageId: input.dmID,
              type: input.reaction,
              count: 1,
              reactingUsers: "",
            },
          });
        }
        return "success";
      } catch (e) {
        console.log(e);
        return "error";
      }
    }),
});
