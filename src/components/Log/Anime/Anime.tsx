import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { isConsecutive } from "@/utils/helper";
import { type Anime as AnimeType } from "@/types/Anime";

import { MdEdit, MdDelete } from "react-icons/md";
import { FaBook, FaTv } from "react-icons/fa";
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import DeleteButton from "@/components/Util/DeleteButton";

dayjs.extend(relativeTime);

interface Props {
    anime: AnimeType;
    onDeleteClick: (anime: AnimeType) => void;
    onEditClick: (anime: AnimeType) => void;
    isSharedLog: boolean;
    index: number;
}

function arrayToString(array: number[]): string {
    if (array?.length > 1 && isConsecutive(array))
        return `${array[0] || "?"}-${array[array.length - 1] || "?"}`;
    else return array?.join(", ");
}

const Anime: React.FC<Props> = ({
    anime,
    onDeleteClick,
    onEditClick,
    isSharedLog = false,
    index,
}) => {
    return (
        <motion.div
            className={`relative
            rounded bg-gray-200 shadow-sm
			shadow-gray-400 dark:bg-slate-900 dark:text-white`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.3, delay: index * 0.05 },
            }}
            exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.3 },
            }}
            layout
        >
            <div className="grid grid-cols-[150px_1fr] grid-rows-[210px_1fr] sm:grid-cols-[150px_1fr_1fr] sm:grid-rows-[210px]">
                {/* Type symbol */}
                <Tippy
                    content={anime.isManga ? "Manga" : "Anime"}
                    placement="right"
                >
                    <div className="absolute top-1 left-1 rounded-lg bg-white/30 p-2 backdrop-blur-lg dark:bg-black/30">
                        {anime.isManga ? (
                            <FaBook className="text-xl" />
                        ) : (
                            <FaTv className="text-xl" />
                        )}
                    </div>
                </Tippy>
                {/* Image */}
                <a
                    className={`block h-[210px] w-[150px] self-center`}
                    target="_blank"
                    {...(anime.link && { href: anime.link })}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="h-full w-full rounded-l"
                        src={anime.imageUrl || "/placeholder.jpg"}
                        alt={anime.title}
                        height={210}
                        width={150}
                    />
                </a>

                {/* Title, rating and notes */}
                <div className="col-span-2 flex flex-col overflow-hidden px-2 py-2 sm:col-span-1">
                    <div>
                        <span className="float-right mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                            {anime.rating} / 10
                        </span>
                        <div className="font-bold">{anime.title}</div>
                        <div className="text-sm dark:text-slate-300">
                            {anime.startDate
                                ? dayjs(anime.startDate).format("DD.MM.YYYY")
                                : "-"}
                        </div>
                        <Tippy
                            content={
                                anime.updatedAt
                                    ? dayjs(anime.updatedAt).format(
                                          "DD.MM.YYYY HH:mm:ss"
                                      )
                                    : "-"
                            }
                        >
                            <div className="text-xs dark:text-slate-300">
                                {`Last updated: ${
                                    anime.updatedAt
                                        ? dayjs(anime.updatedAt).fromNow()
                                        : "-"
                                }`}
                            </div>
                        </Tippy>
                        <hr className="border-black dark:border-white" />
                    </div>
                    <div className="h-full overflow-y-auto pt-1">
                        <span className="whitespace-pre-line break-words">
                            {anime.note}
                        </span>
                    </div>
                </div>

                {/* Season, Movie, OVA */}
                <div className="col-start-2 row-start-1 flex flex-col border-black px-2 py-2 dark:border-white sm:col-start-3 sm:border-l">
                    <div className="basis-1/3">
                        <div className="font-semibold">Seasons</div>
                        <div className="overflow-x-auto whitespace-nowrap">
                            {arrayToString(anime.seasons) || "-"}
                        </div>
                    </div>
                    <div className="basis-1/3">
                        <hr className="border-black dark:border-white" />
                        <div className="font-semibold">Movies</div>
                        <div className="overflow-x-auto whitespace-nowrap">
                            {arrayToString(anime.movies) || "-"}
                        </div>
                    </div>
                    <div className="basis-1/3">
                        <hr className="border-black dark:border-white" />
                        <div className="font-semibold">OVAs</div>
                        <div className="overflow-x-auto whitespace-nowrap">
                            {arrayToString(anime.ovas) || "-"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit and Delete Button */}
            {!isSharedLog && (
                <div className="absolute top-1 right-1 columns-1">
                    <Tippy
                        content={`Edit this ${
                            anime.isManga ? "Manga" : "Anime"
                        }`}
                    >
                        <button
                            onClick={() => onEditClick(anime)}
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm text-white hover:text-base"
                        >
                            <MdEdit />
                        </button>
                    </Tippy>
                    <DeleteButton
                        title={`Delete "${anime.title}"?`}
                        text="You won't be able to revert this!"
                        successTitle="Deleted!"
                        successText={`"${anime.title}" has been deleted.`}
                        tooltip={`Delete this ${
                            anime.isManga ? "Manga" : "Anime"
                        }`}
                        onDeleteClick={() => onDeleteClick(anime)}
                        className="my-1 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm text-white hover:text-base"
                    >
                        <MdDelete />
                    </DeleteButton>
                </div>
            )}
        </motion.div>
    );
};

export default Anime;
