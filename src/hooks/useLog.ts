import { useState } from "react";
import { type Anime } from "@/types/Anime";
import { logOptionsValidator } from "@/types/LogOptions";
import { api } from "@/utils/api";

function useLog(shareId: string | undefined) {
    const [logOptions, setLogOptions] = useState(
        logOptionsValidator.parse(undefined)
    );

    const queryInput = {
        shareId: shareId,
        logOptions: logOptions,
        limit: 24,
    };

    const ctx = api.useContext();

    const getAnimeCount = api.anime.count.useQuery({
        shareId: shareId,
        logOptions,
    });

    const getAnime = api.anime.infinite.useInfiniteQuery(queryInput, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const addAnime = api.anime.add.useMutation({
        onMutate: async (addedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);
            await ctx.anime.count.cancel({ shareId: shareId });

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
                        items: [
                            { ...addedAnime, id: "temp-id" },
                            ...page.items,
                        ] as Anime[],
                    })),
                };
            });

            // Optimistically update anime count
            ctx.anime.count.setData(
                { shareId: shareId },
                (data) => (data ?? 0) + 1
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
            void ctx.anime.count.invalidate({ shareId: shareId });
        },
    });

    const updateAnime = api.anime.update.useMutation({
        onMutate: async (updatedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);

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
                                ? ({
                                      ...updatedAnime,
                                      updatedAt: new Date(),
                                  } as Anime)
                                : a
                        ),
                    })),
                };
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
        },
    });

    const deleteAnime = api.anime.delete.useMutation({
        onMutate: async (deletedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.anime.infinite.cancel(queryInput);
            await ctx.anime.count.cancel({ shareId: shareId });

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
                        items: page.items.filter(
                            (a) => a.id !== deletedAnime.id
                        ),
                    })),
                };
            });
            // Optimistically update anime count
            ctx.anime.count.setData(
                { shareId: shareId },
                (data) => (data ?? 0) - 1
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.anime.infinite.invalidate(queryInput);
            void ctx.anime.count.invalidate({ shareId: shareId });
        },
    });

    return {
        getAnime,
        addAnime,
        updateAnime,
        deleteAnime,
        getAnimeCount,
        logOptions,
        setLogOptions,
    };
}

export default useLog;
