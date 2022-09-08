import { Anime } from "@/types/Anime";
import { Order } from "@/types/Order";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

function useLog(shareId: string | undefined) {
    const [order, setOrder] = useState(Order.title);
    const [ascending, setAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const queryInput = {
        shareId: shareId,
        order: order,
        asc: ascending,
        searchTerm: searchTerm,
        limit: 20,
    };

    const ctx = trpc.useContext();

    const getAnimeCount = trpc.useQuery(["anime.count", { shareId: shareId }]);

    const getAnime = trpc.useInfiniteQuery(
        ["anime.infiniteAnime", queryInput],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const addAnime = trpc.useMutation("anime.add", {
        onMutate: async (addedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infiniteAnime", queryInput]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(
                ["anime.infiniteAnime", queryInput],
                (data) => {
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
                }
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infiniteAnime", queryInput]);
        },
    });

    const updateAnime = trpc.useMutation("anime.update", {
        onMutate: async (updatedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infiniteAnime", queryInput]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(
                ["anime.infiniteAnime", queryInput],
                (data) => {
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
                }
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infiniteAnime", queryInput]);
        },
    });

    const deleteAnime = trpc.useMutation("anime.delete", {
        onMutate: async (deletedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.infiniteAnime", queryInput]);

            // Optimistically update to the new value
            ctx.setInfiniteQueryData(
                ["anime.infiniteAnime", queryInput],
                (data) => {
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
                }
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.infiniteAnime", queryInput]);
        },
    });

    return {
        getAnime,
        addAnime,
        updateAnime,
        deleteAnime,
        getAnimeCount,
        filters: {
            order,
            searchTerm,
            ascending,
            setOrder,
            setSearchTerm,
            setAscending,
        },
    };
}

export default useLog;
