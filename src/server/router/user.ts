import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import cuid from "cuid";

export const userRouter = createProtectedRouter()
	.query("get-shareId", {
		resolve: async ({ ctx }) => {
			return await ctx.prisma.user.findUnique({
				where: { id: ctx.session.user.id },
				select: {
					shareId: true,
				},
			});
		},
	})
	.mutation("add-shareId", {
		resolve: async ({ ctx }) => {
			return await ctx.prisma.user.update({
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
		},
	})
	.mutation("delete-shareId", {
		resolve: async ({ ctx }) => {
			return await ctx.prisma.user.update({
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
		},
	})
	.query("get-byShareId", {
		input: z.object({
			shareId: z.string(),
		}),
		resolve: async ({ ctx, input }) => {
			return await ctx.prisma.user.findUnique({
				where: { shareId: input.shareId },
			});
		},
	});
