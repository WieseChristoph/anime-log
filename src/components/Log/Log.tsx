import SortAndSearch from "./LogSortAndSearch";
import Head from "next/head";
import { useState } from "react";
import PropTypes from "prop-types";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import ErrorAlert from "../Util/ErrorAlert";
import Anime from "./Anime/Anime";
import AnimeEdit from "./Anime/AnimeEdit";
import { FaPlus } from "react-icons/fa";
import Loading from "../Util/Loading";
import { Anime as AnimeType } from "@/types/Anime";
import useLog from "@/hooks/useLog";
import { trpc } from "@/utils/trpc";
import InfoAlert from "../Util/InfoAlert";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface Props {
    shareId?: string;
}

function Log({ shareId }: Props) {
    const [showEditAnime, setShowEditAnime] = useState(false);
    const [animeToEdit, setAnimeToEdit] = useState<AnimeType>();

    const { ref: inViewRef } = useInView({
        onChange: (inView) => inView && getAnime.fetchNextPage(),
    });

    const {
        getAnime,
        addAnime,
        updateAnime,
        deleteAnime,
        getAnimeCount,
        logOptions,
        setLogOptions,
    } = useLog(shareId);

    const getUserByShareId = trpc.useQuery(
        ["user.get-byShareId", { shareId: shareId as string }],
        { enabled: !!shareId }
    );

    async function handleSaveButtonClick(anime: AnimeType) {
        try {
            anime.id
                ? await updateAnime.mutateAsync(anime)
                : await addAnime.mutateAsync(anime);
            setShowEditAnime(false);
            setAnimeToEdit(undefined);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: (error as Error).message,
            };
        }
    }

    // Error Alert
    if (getAnime.isError || getUserByShareId.isError)
        return (
            <div className="p-5">
                <ErrorAlert
                    message={
                        getAnime.error?.message ||
                        getUserByShareId.error?.message
                    }
                />
            </div>
        );

    // Invalid share id alert
    if (getUserByShareId.isFetched && !getUserByShareId.data)
        return <InfoAlert message="No log with this id" />;

    return (
        <div className="container mx-auto px-5 py-4">
            {getUserByShareId.data && (
                <Head>
                    <title>
                        {getUserByShareId.data.name}&apos;s Log | Anime Log
                    </title>
                </Head>
            )}

            <SortAndSearch
                logOptions={logOptions}
                onLogOptionsChange={setLogOptions}
            />

            <div className="my-4 flex flex-row items-center">
                {/* Anime count */}
                <div className="mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                    {getAnimeCount.data}
                    {logOptions.filter.anime && logOptions.filter.manga
                        ? " Anime / Manga "
                        : logOptions.filter.anime
                        ? " Anime "
                        : " Manga "}
                    in total
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
                    <Tippy content="Add new Anime">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditAnime(!showEditAnime);
                            }}
                            className="ml-auto rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-2 text-center text-lg font-medium text-white"
                        >
                            <FaPlus />
                        </button>
                    </Tippy>
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
                onSaveButtonClick={handleSaveButtonClick}
            />

            {/* Main log grid */}
            {getAnime.isLoading ? (
                <Loading />
            ) : (
                <>
                    {/* Log */}
                    <motion.div
                        className="grid grid-cols-1 justify-start gap-4 xl:grid-cols-2"
                        layout
                    >
                        {/* All entries */}
                        {getAnime.data?.pages.map((page) =>
                            page.items.map((anime, iIndex) => (
                                <Anime
                                    key={anime.id}
                                    anime={anime}
                                    onDeleteClick={(a) => deleteAnime.mutate(a)}
                                    onEditClick={(a) => {
                                        setAnimeToEdit(a);
                                        setShowEditAnime(true);
                                    }}
                                    isSharedLog={shareId !== undefined}
                                    index={iIndex}
                                />
                            ))
                        )}
                    </motion.div>

                    {/* Loading spinner for infinite query */}
                    <div
                        ref={inViewRef}
                        className={!getAnime.hasNextPage ? "hidden" : ""}
                    >
                        <Loading />
                    </div>
                </>
            )}
        </div>
    );
}

Log.propTypes = {
    shareId: PropTypes.string,
};

export default Log;
