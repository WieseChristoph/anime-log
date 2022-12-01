import { Anime } from "@/types/Anime";
import { logOptionsValidator } from "@/types/LogOptions";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

function useLog(shareId: string | undefined) {
    const [logOptions, setLogOptions] = useState(
        logOptionsValidator.parse(undefined)
    );

    const queryInput = {
        shareId: shareId,
        logOptions: logOptions,
        limit: 16,
    };

    const ctx = trpc.useContext();

    const getAnimeCount = trpc.useQuery([
        "anime.count",
        { shareId: shareId, logOptions },
    ]);

    const getAnime = trpc.useInfiniteQuery(["anime.infinite", queryInput], {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const addAnime = trpc.useMutation("anime.add", {
        onMutate: async (addedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infinite", queryInput]);
            await ctx.cancelQuery(["anime.count", { shareId: shareId }]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(["anime.infinite", queryInput], (data) => {
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
            ctx.setQueryData(
                ["anime.count", { shareId: shareId }],
                (data) => (data ?? 0) + 1
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infinite", queryInput]);
            ctx.invalidateQueries(["anime.count", { shareId: shareId }]);
        },
    });

    const updateAnime = trpc.useMutation("anime.update", {
        onMutate: async (updatedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infinite", queryInput]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(["anime.infinite", queryInput], (data) => {
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
                        ) as Anime[],
                    })),
                };
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infinite", queryInput]);
        },
    });

    const deleteAnime = trpc.useMutation("anime.delete", {
        onMutate: async (deletedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infinite", queryInput]);
            await ctx.cancelQuery(["anime.count", { shareId: shareId }]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(["anime.infinite", queryInput], (data) => {
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
            ctx.setQueryData(
                ["anime.count", { shareId: shareId }],
                (data) => (data ?? 0) - 1
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infinite", queryInput]);
            ctx.invalidateQueries(["anime.count", { shareId: shareId }]);
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
