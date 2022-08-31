import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const savedUserRouter = createProtectedRouter()
    .query("get-all", {
        resolve: async ({ ctx }) => {
            return await ctx.prisma.savedUser.findMany({
                where: { user: { id: ctx.session.user.id } },
                include: { savedUser: true },
            });
        },
    })
    .mutation("add", {
        input: z.object({
            shareId: z.string(),
        }),
        resolve: async ({ ctx, input }) => {
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
        },
    })
    .mutation("delete", {
        input: z.object({
            shareId: z.string(),
        }),
        resolve: async ({ ctx, input }) => {
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
        },
    });
