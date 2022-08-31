import PropTypes from "prop-types";
import moment from "moment";
import { MdEdit, MdDelete } from "react-icons/md";
import { Anime as AnimeType } from "@/types/Anime";

const IMAGE_HEIGHT = 210;
const IMAGE_WIDTH = 150;

interface Props {
    anime: AnimeType;
    onDeleteClick: (anime: AnimeType) => void;
    onEditClick: (anime: AnimeType) => void;
    isSharedLog: boolean;
}

function isConsecutive(array: number[]): boolean {
    const sorted = array?.sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] !== sorted[i] + 1) {
            return false;
        }
    }
    return true;
}

function arrayToString(array: number[]): string {
    if (array?.length > 1 && isConsecutive(array))
        return `${array[0]}-${array[array.length - 1]}`;
    else return array?.join(", ");
}

function Anime({
    anime,
    onDeleteClick,
    onEditClick,
    isSharedLog = false,
}: Props) {
    return (
        <div
            className={`relative rounded
            bg-gray-200 shadow-sm shadow-gray-400
			dark:bg-slate-900 dark:text-white`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <a
                    className="block h-[210px] w-[150px] self-center"
                    target="_blank"
                    {...(anime.link && { href: anime.link })}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="h-full w-full rounded-l"
                        src={anime.imageUrl || "/placeholder.jpg"}
                        alt={anime.title}
                        height={IMAGE_HEIGHT}
                        width={IMAGE_WIDTH}
                    />
                </a>

                <div
                    className={`grid flex-1 grid-cols-1 grid-rows-2 py-2 sm:grid-cols-2 sm:grid-rows-1 h-[${IMAGE_HEIGHT}px]`}
                >
                    {/* Title, rating and notes */}
                    <div className="flex flex-col overflow-hidden px-2">
                        <div>
                            <span className="float-right mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                                {anime.rating} / 10
                            </span>
                            <div className="font-bold">{anime.title}</div>
                            <div className="text-sm dark:text-slate-300">
                                {anime.startDate
                                    ? moment(anime.startDate).format(
                                          "DD.MM.yyyy"
                                      )
                                    : "-"}
                            </div>
                            <div className="text-xs dark:text-slate-300">
                                Last updated:
                                {anime.updatedAt
                                    ? moment(anime.updatedAt).format(
                                          " DD.MM.yyyy"
                                      )
                                    : " -"}
                            </div>
                            <hr className="border-black dark:border-white" />
                        </div>
                        <div className="overflow-y-auto pt-1">
                            <span className="break-words">{anime.note}</span>
                        </div>
                    </div>

                    {/* Season, Movie, OVA */}
                    <div className="flex flex-col border-black px-2 dark:border-white sm:border-l">
                        <div className="basis-1/3">
                            <div className="font-semibold">Season</div>
                            <div className="overflow-x-auto whitespace-nowrap">
                                {arrayToString(anime.seasons) || "-"}
                            </div>
                        </div>
                        <div className="basis-1/3">
                            <hr className="border-black dark:border-white" />
                            <div className="font-semibold">Movie</div>
                            <div className="overflow-x-auto whitespace-nowrap">
                                {arrayToString(anime.movies) || "-"}
                            </div>
                        </div>
                        <div className="basis-1/3">
                            <hr className="border-black dark:border-white" />
                            <div className="font-semibold">OVA</div>
                            <div className="overflow-x-auto whitespace-nowrap">
                                {arrayToString(anime.ovas) || "-"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit and Delete Button */}
            {!isSharedLog && (
                <div className="absolute top-1 right-1 columns-1">
                    <button
                        onClick={() => onEditClick(anime)}
                        className="hover:text-md flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm text-white"
                    >
                        <MdEdit />
                    </button>
                    <button
                        onClick={() =>
                            window.confirm(`Delete ${anime.title}?`) &&
                            onDeleteClick(anime)
                        }
                        className="hover:text-md my-1 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm text-white"
                    >
                        <MdDelete />
                    </button>
                </div>
            )}
        </div>
    );
}

Anime.propTypes = {
    anime: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func,
    onEditClick: PropTypes.func,
    isSharedLog: PropTypes.bool,
};

export default Anime;
