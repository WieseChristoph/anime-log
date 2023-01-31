import { z } from "zod";
import { animeValidator } from "@/types/Anime";
import { logOptionsValidator, Order } from "@/types/LogOptions";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@prisma/client";

export const animeRouter = createTRPCRouter({
    get: publicProcedure
        .input(
            z.object({
                shareId: z.string().nullish(),
                logOptions: logOptionsValidator.nullish(),
            })
        )
        .query(({ ctx, input }) => {
            if (!input.shareId && !ctx.session)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Must be logged in to access own log.",
                });

            return ctx.prisma.anime.findMany({
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session?.user?.id }),
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
        }),
    // TODO: Some anime are doubled when fetching
    infinite: publicProcedure
        .input(
            z.object({
                shareId: z.string().nullish(),
                logOptions: logOptionsValidator.nullish(),
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
            })
        )
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 50;
            const { cursor } = input;

            if (!input.shareId && !ctx.session)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Must be logged in to access own log.",
                });

            const items = await ctx.prisma.anime.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session?.user?.id }),
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
        }),
    count: publicProcedure
        .input(
            z.object({
                shareId: z.string().nullish(),
                logOptions: logOptionsValidator.nullish(),
            })
        )
        .query(({ ctx, input }) => {
            if (!input.shareId && !ctx.session)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Must be logged in to access own log.",
                });

            return ctx.prisma.anime.count({
                where: {
                    user: {
                        ...(input.shareId
                            ? { shareId: input.shareId }
                            : { id: ctx.session?.user?.id }),
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
            });
        }),
    add: protectedProcedure
        .input(
            animeValidator
                .omit({ id: true, updatedAt: true, createdAt: true })
                .partial({
                    startDate: true,
                    link: true,
                    note: true,
                    imageUrl: true,
                })
        )
        .mutation(({ ctx, input }) => {
            return ctx.prisma.anime.create({
                data: {
                    ...input,
                    user: { connect: { id: ctx.session.user.id } },
                    updatedAt: undefined,
                },
            });
        }),
    update: protectedProcedure
        .input(animeValidator.partial({ imageUrl: true }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.anime.update({
                where: { id: input.id },
                data: {
                    ...input,
                    user: { connect: { id: ctx.session.user.id } },
                    updatedAt: undefined,
                },
            });
        }),
    delete: protectedProcedure
        .input(animeValidator)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.anime.delete({
                where: { id: input.id },
            });
        }),
    getCountByType: protectedProcedure.query(({ ctx }) => {
        if (ctx.session.user.role !== UserRole.ADMIN)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Must be admin to access this path.",
            });

        return ctx.prisma.anime.groupBy({
            by: ["isManga"],
            _count: { _all: true },
        });
    }),
});
