import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { user_role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    delete: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.user.role !== user_role.ADMIN)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Must be admin to access this path.",
                });

            return ctx.prisma.$transaction([
                // delete saved users
                ctx.prisma.savedUser.deleteMany({
                    where: {
                        OR: [
                            { userId: input.userId },
                            { savedUserId: input.userId },
                        ],
                    },
                }),
                // delete anime/manga
                ctx.prisma.anime.deleteMany({
                    where: {
                        userId: input.userId,
                    },
                }),
                // delete session
                ctx.prisma.session.deleteMany({
                    where: {
                        userId: input.userId,
                    },
                }),
                // delete account
                ctx.prisma.account.deleteMany({
                    where: {
                        userId: input.userId,
                    },
                }),
                // delete user
                ctx.prisma.user.deleteMany({
                    where: { id: input.userId },
                }),
            ]);
        }),
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
                shareId: createId(),
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
    getAll: protectedProcedure.query(({ ctx }) => {
        if (ctx.session.user.role !== user_role.ADMIN)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Must be admin to access this path.",
            });

        return ctx.prisma.user.findMany({
            include: {
                savedUsers: true,
                savedByUsers: true,
                sessions: true,
            },
        });
    }),
    getCount: protectedProcedure.query(({ ctx }) => {
        if (ctx.session.user.role !== user_role.ADMIN)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Must be admin to access this path.",
            });

        return ctx.prisma.user.count();
    }),
});
