import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
    me: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUniqueOrThrow({
            where: { id: ctx.session.user.id },
            select: { id: true, name: true, email: true, image: true, role: true },
        });
    }),
    delete: protectedProcedure.input(z.object({ userId: z.string() })).mutation(async ({ ctx, input }) => {
        if (ctx.session.user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Must be admin to access this path.',
            });
        }

        return ctx.prisma.$transaction([
            // delete saved users
            ctx.prisma.savedUser.deleteMany({
                where: {
                    OR: [{ userId: input.userId }, { savedUserId: input.userId }],
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
            }),
        )
        .query(({ ctx, input }) => {
            return ctx.prisma.user.findUnique({
                where: { shareId: input.shareId },
                select: {
                    name: true,
                    image: true,
                },
            });
        }),
    getAll: protectedProcedure.query(({ ctx }) => {
        if (ctx.session.user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Must be admin to access this path.',
            });
        }

        return ctx.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                shareId: true,
                sessions: {
                    select: {
                        expires: true,
                    },
                },
            },
        });
    }),
    getCount: protectedProcedure.query(({ ctx }) => {
        if (ctx.session.user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Must be admin to access this path.',
            });
        }

        return ctx.prisma.user.count();
    }),
});
