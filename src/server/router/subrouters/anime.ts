import { z } from "zod";
import { createProtectedRouter } from "../protected-router";
import { animeValidator } from "@/types/Anime";
import { logOptionsValidator, Order } from "@/types/LogOptions";

export const animeRouter = createProtectedRouter()
    .query("get", {
        input: z.object({
            shareId: z.string().nullish(),
            logOptions: logOptionsValidator.nullish(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.anime.findMany({
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session.user.id }),
                    },
                    ...(input.logOptions?.searchTerm && {
                        title: {
                            contains: input.logOptions.searchTerm,
                            mode: "insensitive",
                        },
                    }),
                    ...(input.logOptions?.filter &&
                        input.logOptions.filter.anime !==
                            input.logOptions.filter.manga && {
                            isManga: {
                                equals: input.logOptions.filter.manga,
                            },
                        }),
                },
                orderBy: {
                    [input.logOptions?.order ?? Order.TITLE]: input.logOptions
                        ?.asc
                        ? "asc"
                        : "desc",
                },
                select: {
                    id: true,
                    user: false,
                    userId: false,
                    isManga: true,
                    title: true,
                    imageUrl: true,
                    hasCustomImage: true,
                    updatedAt: true,
                    createdAt: true,
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
    // TODO: Some anime are doubled when fetching
    .query("infinite", {
        input: z.object({
            shareId: z.string().nullish(),
            logOptions: logOptionsValidator.nullish(),
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        }),
        async resolve({ ctx, input }) {
            const limit = input.limit ?? 50;
            const { cursor } = input;

            const items = await ctx.prisma.anime.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session.user.id }),
                    },
                    ...(input.logOptions?.searchTerm && {
                        title: {
                            contains: input.logOptions.searchTerm,
                            mode: "insensitive",
                        },
                    }),
                    ...(input.logOptions?.filter &&
                        input.logOptions.filter.anime !==
                            input.logOptions.filter.manga && {
                            isManga: {
                                equals: input.logOptions.filter.manga,
                            },
                        }),
                },
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    [input.logOptions?.order ?? Order.TITLE]: input.logOptions
                        ?.asc
                        ? "asc"
                        : "desc",
                },
                select: {
                    id: true,
                    isManga: true,
                    user: false,
                    userId: false,
                    title: true,
                    imageUrl: true,
                    hasCustomImage: true,
                    updatedAt: true,
                    createdAt: true,
                    link: true,
                    note: true,
                    rating: true,
                    startDate: true,
                    seasons: true,
                    movies: true,
                    ovas: true,
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                const nextItem = items.pop();
                nextCursor = nextItem?.id;
            }
            return {
                items,
                nextCursor,
            };
        },
    })
    .query("count", {
        input: z.object({
            shareId: z.string().nullish(),
        }),
        resolve: async ({ ctx, input }) => {
            return await ctx.prisma.anime.count({
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session.user.id }),
                    },
                },
            });
        },
    })
    .mutation("add", {
        input: animeValidator
            .omit({ id: true, updatedAt: true, createdAt: true })
            .partial({
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
                    updatedAt: undefined,
                },
            });
        },
    })
    .mutation("update", {
        input: animeValidator.partial({ imageUrl: true }),
        resolve: async ({ ctx, input }) => {
            return await ctx.prisma.anime.update({
                where: { id: input.id },
                data: {
                    ...input,
                    user: { connect: { id: ctx.session.user.id } },
                    updatedAt: undefined,
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
