import SortAndSearch from "./LogSortAndSearch";
import { Order } from "./LogSortAndSearch";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { trpc } from "@/utils/trpc";
import ErrorAlert from "../Util/ErrorAlert";
import Anime from "./Anime/Anime";
import AnimeEdit from "./Anime/AnimeEdit";
import { FaPlus } from "react-icons/fa";
import Loading from "../Util/Loading";
import { Anime as AnimeType } from "@/types/Anime";

interface Props {
    shareId?: string;
}

function Log({ shareId }: Props) {
    const [order, setOrder] = useState(Order.title);
    const [ascending, setAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showEditAnime, setShowEditAnime] = useState(false);
    const [animeToEdit, setAnimeToEdit] = useState<AnimeType>();

    const ctx = trpc.useContext();

    const getUserByShareId = trpc.useQuery(
        ["user.get-byShareId", { shareId: shareId as string }],
        { enabled: !!shareId }
    );

    const getAnime = trpc.useQuery(["anime.get-all", { shareId: shareId }]);

    const addAnime = trpc.useMutation("anime.add", {
        onMutate: async (newAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.get-all", { shareId: shareId }]);

            // Snapshot the previous value
            const previousAnime = ctx.getQueryData([
                "anime.get-all",
                { shareId: shareId },
            ]);

            // Optimistically update to the new value
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                (oldAnime = []) =>
                    [
                        ...oldAnime,
                        { ...newAnime, id: "temp-id", updatedAt: new Date() },
                    ] as AnimeType[]
            );

            // Return a context object with the snapshotted value
            return { previousAnime };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _newAnime, context) => {
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                () => context?.previousAnime ?? []
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.get-all", { shareId: shareId }]);
        },
    });

    const updateAnime = trpc.useMutation("anime.update", {
        onMutate: async (updatedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.get-all", { shareId: shareId }]);

            // Snapshot the previous value
            const previousAnime = ctx.getQueryData([
                "anime.get-all",
                { shareId: shareId },
            ]);

            // Optimistically update to the new value
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                (oldAnime = []) =>
                    oldAnime.map((a) =>
                        a.id === updatedAnime.id
                            ? ({
                                  ...updatedAnime,
                                  updatedAt: new Date(),
                              } as AnimeType)
                            : a
                    )
            );

            // Return a context object with the snapshotted value
            return { previousAnime };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _updatedAnime, context) => {
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                () => context?.previousAnime ?? []
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.get-all", { shareId: shareId }]);
        },
    });

    const deleteAnime = trpc.useMutation("anime.delete", {
        onMutate: async (deletedAnime) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.cancelQuery(["anime.get-all", { shareId: shareId }]);

            // Snapshot the previous value
            const previousAnime = ctx.getQueryData([
                "anime.get-all",
                { shareId: shareId },
            ]);

            // Optimistically update to the new value
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                (oldAnime = []) =>
                    oldAnime.filter((a) => a.id !== deletedAnime.id)
            );

            // Return a context object with the snapshotted value
            return { previousAnime };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _deletedAnime, context) => {
            ctx.setQueryData(
                ["anime.get-all", { shareId: shareId }],
                () => context?.previousAnime ?? []
            );
        },
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["anime.get-all", { shareId: shareId }]);
        },
    });

    const processedLog = useMemo(() => {
        if (!getAnime.data) return [];

        // apply order
        switch (order) {
            case Order.title:
                getAnime.data.sort((a, b) =>
                    ascending
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title)
                );
                break;
            case Order.startDate:
                // order by start date, if not set its at the bottom
                getAnime.data.sort((a, b) =>
                    b.startDate
                        ? ascending
                            ? moment(b.startDate).valueOf() -
                              moment(a.startDate).valueOf()
                            : moment(a.startDate).valueOf() -
                              moment(b.startDate).valueOf()
                        : -1
                );
                break;
            case Order.rating:
                getAnime.data.sort((a, b) =>
                    ascending ? b.rating - a.rating : a.rating - b.rating
                );
                break;
            case Order.updatedAt:
                getAnime.data.sort((a, b) =>
                    ascending
                        ? moment(b.updatedAt).valueOf() -
                          moment(a.updatedAt).valueOf()
                        : moment(a.updatedAt).valueOf() -
                          moment(b.updatedAt).valueOf()
                );
                break;
            default:
                break;
        }

        // apply search term
        return getAnime.data.filter((e) =>
            e.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [getAnime.data, order, ascending, searchTerm]);

    if (getAnime.isError)
        return (
            <div className="p-5">
                <ErrorAlert message={getAnime.error.message} />
            </div>
        );

    if (getAnime.isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-5 py-4">
            <SortAndSearch
                currentOrder={order}
                ascending={ascending}
                onOrderChange={setOrder}
                onSearchChange={setSearchTerm}
                onAscendingChange={setAscending}
            />

            <div className="my-4 flex flex-row items-center">
                {/* Anime count */}
                <div className="mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                    Showing {processedLog.length} Anime
                </div>
                {/* Shared Log Username */}
                {getUserByShareId.data && (
                    <div className="ml-auto mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                        Log of
                        <b> {getUserByShareId.data.name}</b>
                    </div>
                )}
                {/* Add new Anime button */}
                {!shareId && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowEditAnime(!showEditAnime);
                        }}
                        className="ml-auto rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-2 text-center text-lg font-medium text-white"
                    >
                        <FaPlus />
                    </button>
                )}
            </div>

            {/* Anime Edit Form */}
            <AnimeEdit
                key={animeToEdit?.id}
                isOpen={showEditAnime}
                initialAnime={animeToEdit}
                onCancelButtonClick={() => {
                    setShowEditAnime(false);
                    setAnimeToEdit(undefined);
                }}
                onSaveButtonClick={(a) => {
                    a.id ? updateAnime.mutate(a) : addAnime.mutate(a);
                    setShowEditAnime(false);
                    setAnimeToEdit(undefined);
                }}
            />

            {/* Main log grid */}
            <div className="grid grid-cols-1 justify-start gap-4 xl:grid-cols-2">
                {/* All entries */}
                {processedLog.map((anime) => (
                    <Anime
                        key={anime.id}
                        anime={anime}
                        onDeleteClick={(a) => deleteAnime.mutate(a)}
                        onEditClick={(a) => {
                            setAnimeToEdit(a);
                            setShowEditAnime(true);
                        }}
                        isSharedLog={shareId !== undefined}
                    />
                ))}
            </div>
        </div>
    );
}

Log.propTypes = {
    shareId: PropTypes.string,
};

export default Log;
