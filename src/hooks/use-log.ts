import { useState } from 'react';
import type { Anime } from '@/types/anime';
import { type LogOptionsType as LogOptions, OrderValues as Order } from '@/types/log-options';
import { trpc } from '@/utils/trpc';

function useLog(shareId: string | undefined) {
    const [logOptions, setLogOptions] = useState<LogOptions>({
        order: Order.TITLE,
        asc: true,
        searchTerm: '',
        filter: {
            anime: true,
            manga: true,
            favorites: false,
            statuses: [],
        },
    });

    const queryInput = {
        shareId: shareId,
        logOptions: logOptions,
        limit: 24,
    };

    const ctx = trpc.useUtils();

    const getAnimeSummary = trpc.anime.summary.useQuery({ shareId });

    const getAnime = trpc.anime.infinite.useInfiniteQuery(queryInput, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const addAnime = trpc.anime.add.useMutation({
        onMutate: async (addedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);
            await ctx.anime.summary.cancel({ shareId: shareId });

            // Optimistically update to the new value
            ctx.anime.infinite.setInfiniteData(queryInput, (data) => {
                if (!data) {
                    return {
                        pages: [],
                        pageParams: [],
                    };
                }

                const optimisticEntry: Anime = {
                    id: 'temp-id',
                    title: addedAnime.title,
                    isManga: addedAnime.isManga ?? false,
                    seasons: addedAnime.seasons ?? [],
                    movies: addedAnime.movies ?? [],
                    ovas: addedAnime.ovas ?? [],
                    rating: addedAnime.rating ?? 5,
                    favorite: addedAnime.favorite ?? false,
                    status: addedAnime.status ?? 'PLANNED',
                    link: addedAnime.link ?? null,
                    note: addedAnime.note ?? null,
                    imageUrl: addedAnime.imageUrl ?? null,
                    hasCustomImage: addedAnime.hasCustomImage ?? false,
                    startDate: addedAnime.startDate ?? null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                return {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        items: [optimisticEntry, ...page.items],
                    })),
                };
            });

        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
            void ctx.anime.summary.invalidate({ shareId: shareId });
        },
    });

    const updateAnime = trpc.anime.update.useMutation({
        onMutate: async (updatedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);
            await ctx.anime.summary.cancel({ shareId: shareId });

            // Optimistically update to the new value
            ctx.anime.infinite.setInfiniteData(queryInput, (data) => {
                if (!data) {
                    return {
                        pages: [],
                        pageParams: [],
                    };
                }

                return {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        items: page.items.map((a) =>
                            a.id === updatedAnime.id
                                ? {
                                      id: a.id,
                                      title: updatedAnime.title ?? a.title,
                                      isManga: updatedAnime.isManga ?? a.isManga,
                                      seasons: updatedAnime.seasons ?? a.seasons,
                                      movies: updatedAnime.movies ?? a.movies,
                                      ovas: updatedAnime.ovas ?? a.ovas,
                                      rating: updatedAnime.rating ?? a.rating,
                                      favorite: updatedAnime.favorite ?? a.favorite,
                                      status: updatedAnime.status ?? a.status,
                                      link: updatedAnime.link ?? a.link,
                                      note: updatedAnime.note ?? a.note,
                                      imageUrl: updatedAnime.imageUrl ?? null,
                                      hasCustomImage: updatedAnime.hasCustomImage ?? a.hasCustomImage,
                                      startDate: updatedAnime.startDate ?? a.startDate,
                                      createdAt: a.createdAt,
                                      updatedAt: new Date(),
                                  }
                                : a,
                        ),
                    })),
                };
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
            void ctx.anime.summary.invalidate({ shareId: shareId });
        },
    });

    const deleteAnime = trpc.anime.delete.useMutation({
        onMutate: async (deletedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);
            await ctx.anime.summary.cancel({ shareId: shareId });

            // Optimistically update to the new value
            ctx.anime.infinite.setInfiniteData(queryInput, (data) => {
                if (!data) {
                    return {
                        pages: [],
                        pageParams: [],
                    };
                }

                return {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        items: page.items.filter((a) => a.id !== deletedAnime.id),
                    })),
                };
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
            void ctx.anime.summary.invalidate({ shareId: shareId });
        },
    });

    return {
        getAnime,
        addAnime,
        updateAnime,
        deleteAnime,
        getAnimeSummary,
        logOptions,
        setLogOptions,
    };
}

export default useLog;
