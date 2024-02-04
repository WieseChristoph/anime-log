import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Anime as AnimeType } from "@/types/Anime";

import { MdEdit, MdDelete } from "react-icons/md";
import {
    FaBook,
    FaTv,
    FaRegNoteSticky,
    FaArrowsRotate,
    FaRegCalendar,
} from "react-icons/fa6";
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

function arrayToCompactString(array: number[]): string {
    if (array.length == 0) return "";
    if (array.length == 1) return array[0]?.toString() ?? "";

    let compactString = array[0]?.toString() ?? "";
    for (let i = 1; i < array.length; i++) {
        const curr = array[i];
        const prev = array[i - 1];

        if (!prev || !curr) continue;

        if (prev + 1 == curr) {
            // if consecutive
            if (i == array.length - 1) compactString += `-${curr}`;
        } else {
            // if not consecutive
            if (prev !== prev) compactString += `-${prev}`;
            compactString += `, ${curr}`;
        }
    }

    return compactString;
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
            className="w-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.2, delay: index * 0.025 },
            }}
            exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.1 },
            }}
            layout
        >
            <motion.div
                className="relative aspect-[55/78] overflow-hidden rounded-md bg-cover bg-center shadow-md shadow-black/50"
                style={{
                    backgroundImage: `url('${
                        anime.imageUrl || "/placeholder.jpg"
                    }')`,
                }}
                animate={{
                    scale: 1,
                    transition: { duration: 0.05 },
                }}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.05 },
                }}
            >
                <div className="absolute left-1 top-1 flex flex-col gap-2 ">
                    <div className="flex flex-row gap-2">
                        {/* Type symbol */}
                        <Tippy
                            content={anime.isManga ? "Manga" : "Anime"}
                            placement="right"
                        >
                            <div className="rounded-md bg-white/30 p-2 backdrop-blur-lg dark:bg-black/30">
                                {anime.isManga ? (
                                    <FaBook className="text-xl" />
                                ) : (
                                    <FaTv className="text-xl" />
                                )}
                            </div>
                        </Tippy>

                        {/* Note button */}
                        {anime.note && anime.note.length > 0 && (
                            <Tippy
                                content={
                                    <>
                                        <strong>Note</strong>
                                        <br />
                                        <pre className="whitespace-pre-wrap">
                                            {anime.note}
                                        </pre>
                                    </>
                                }
                                placement="bottom"
                            >
                                <div className="rounded-md bg-white/30 p-2 backdrop-blur-lg dark:bg-black/30">
                                    <FaRegNoteSticky className="text-xl" />
                                </div>
                            </Tippy>
                        )}
                    </div>

                    {/* Edit and delete button */}
                    {!isSharedLog && (
                        <div className="z-10 mr-auto flex flex-col gap-2">
                            {/* Edit button */}
                            <Tippy content="Edit" placement="right">
                                <button
                                    className="rounded-md bg-white/30 p-2 backdrop-blur-lg hover:text-yellow-400 dark:bg-black/30"
                                    onClick={() => onEditClick(anime)}
                                >
                                    <MdEdit className="text-xl" />
                                </button>
                            </Tippy>

                            {/* Delete button */}
                            <DeleteButton
                                title={`Delete "${anime.title}"`}
                                text="Are you sure you want to delete this anime?"
                                successTitle="Deleted!"
                                successText={`"${anime.title}" has been deleted.`}
                                tooltip="Delete"
                                tooltipPlacement="right"
                                onDeleteClick={() => onDeleteClick(anime)}
                                className="rounded-md bg-white/30 p-2 backdrop-blur-lg hover:text-red-400 dark:bg-black/30"
                            >
                                <MdDelete className="text-xl" />
                            </DeleteButton>
                        </div>
                    )}
                </div>
                {/* Rating */}
                <div className="absolute right-1 top-1 rounded-md bg-gradient-to-r from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                    {anime.rating} / 10
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex h-3/4 flex-col items-center justify-end bg-gradient-to-b from-transparent to-black/75 p-3">
                    {/* Title */}
                    <div
                        className={`break-words text-center font-bold text-white ${
                            anime.title.length > 50 ? "text-md" : "text-xl"
                        }`}
                        style={{ textShadow: "1px 1px 5px black" }}
                    >
                        {anime.title}
                    </div>
                    <div className="flex flex-row gap-2">
                        {/* Start date */}
                        <div className="flex flex-row items-center gap-1 text-xs text-white">
                            <FaRegCalendar />
                            {anime.startDate
                                ? dayjs(anime.startDate).format("DD.MM.YYYY")
                                : "-"}
                        </div>
                        &bull;
                        {/* Last update */}
                        <Tippy
                            content={
                                anime.updatedAt
                                    ? dayjs(anime.updatedAt).format(
                                          "DD.MM.YYYY HH:mm:ss"
                                      )
                                    : "-"
                            }
                        >
                            <div className="flex flex-row items-center gap-1 text-xs text-white">
                                <FaArrowsRotate />
                                {anime.updatedAt
                                    ? dayjs(anime.updatedAt).fromNow()
                                    : "-"}
                            </div>
                        </Tippy>
                    </div>
                    {/* Season, Movie, OVA */}
                    <div className="flex w-full flex-col gap-1 text-sm text-white">
                        <div className="flex flex-row font-semibold ">
                            <span>Season&nbsp;</span>
                            <span className="max-h-10 overflow-auto break-words">
                                {arrayToCompactString(anime.seasons) || "-"}
                            </span>
                        </div>
                        <hr />
                        <div className="flex flex-row font-semibold">
                            <span>Movie&nbsp;</span>
                            <span className="break-words">
                                {arrayToCompactString(anime.movies) || "-"}
                            </span>
                        </div>
                        <hr />
                        <div className="flex flex-row font-semibold">
                            <span>OVA&nbsp;</span>
                            <span className="break-words">
                                {arrayToCompactString(anime.ovas) || "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Anime;
