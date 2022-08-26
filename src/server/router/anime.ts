import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { animeValidator } from "@/types/Anime";
import { getImageByTitle } from "../utils/kitsu";

export const animeRouter = createProtectedRouter()
	.query("get-all", {
		input: z
			.object({
				shareId: z.string().cuid().nullish(),
			})
			.nullish(),
		resolve: async ({ ctx, input }) => {
			return input?.shareId
				? await ctx.prisma.anime.findMany({
						where: { user: { shareId: input.shareId } },
						select: {
							id: true,
							user: false,
							userId: false,
							title: true,
							imageUrl: true,
							updatedAt: true,
							link: true,
							note: true,
							rating: true,
							startDate: true,
							seasons: true,
							movies: true,
							ovas: true,
						},
				  })
				: await ctx.prisma.anime.findMany({
						where: { user: { id: ctx.session.user.id } },
						select: {
							id: true,
							user: false,
							userId: false,
							title: true,
							imageUrl: true,
							updatedAt: true,
							link: true,
							note: true,
							rating: true,
							startDate: true,
							seasons: true,
							movies: true,
							ovas: true,
						},
				  });
		},
	})
	.mutation("add", {
		input: animeValidator.omit({ id: true, updatedAt: true }).partial({
			startDate: true,
			link: true,
			note: true,
			imageUrl: true,
		}),
		resolve: async ({ ctx, input }) => {
			return await ctx.prisma.anime.create({
				data: {
					...input,
					user: { connect: { id: ctx.session.user.id } },
					imageUrl: await getImageByTitle(input.title),
				},
			});
		},
	})
	.mutation("update", {
		input: animeValidator,
		resolve: async ({ ctx, input }) => {
			console.log("update");
			return await ctx.prisma.anime.update({
				where: { id: input.id },
				data: {
					...input,
					user: { connect: { id: ctx.session.user.id } },
					imageUrl: await getImageByTitle(input.title),
				},
			});
		},
	})
	.mutation("delete", {
		input: animeValidator,
		resolve: async ({ ctx, input }) => {
			return await ctx.prisma.anime.delete({
				where: { id: input.id },
			});
		},
	});
