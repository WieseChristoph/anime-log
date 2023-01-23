import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const savedUserRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.savedUser.findMany({
            where: { user: { id: ctx.session.user.id } },
            include: { savedUser: true },
        });
    }),
    add: protectedProcedure
        .input(
            z.object({
                shareId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const savedUser = await ctx.prisma.user.findUnique({
                where: { shareId: input.shareId },
            });

            if (!savedUser) throw new Error("No user found with this share id");

            return await ctx.prisma.savedUser.create({
                data: {
                    user: { connect: { id: ctx.session.user.id } },
                    savedUser: { connect: { id: savedUser.id } },
                },
            });
        }),
    delete: protectedProcedure
        .input(
            z.object({
                shareId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const savedUser = await ctx.prisma.user.findUnique({
                where: { shareId: input.shareId },
            });

            if (!savedUser) throw new Error("No user found with this share id");

            return await ctx.prisma.savedUser.delete({
                where: {
                    userId_savedUserId: {
                        userId: ctx.session.user.id,
                        savedUserId: savedUser.id,
                    },
                },
            });
        }),
});
