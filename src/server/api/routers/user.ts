import { z } from "zod";
import cuid from "cuid";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getShareId: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUnique({
            where: { id: ctx.session.user.id },
            select: {
                shareId: true,
            },
        });
    }),
    addShareId: protectedProcedure.mutation(({ ctx }) => {
        return ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                shareId: cuid(),
            },
            select: {
                shareId: true,
            },
        });
    }),
    deleteShareId: protectedProcedure.mutation(({ ctx }) => {
        return ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                shareId: null,
                savedByUsers: {
                    deleteMany: {
                        savedUserId: ctx.session.user.id,
                    },
                },
            },
        });
    }),
    getByShareId: publicProcedure
        .input(
            z.object({
                shareId: z.string(),
            })
        )
        .query(({ ctx, input }) => {
            return ctx.prisma.user.findUnique({
                where: { shareId: input.shareId },
            });
        }),
});
