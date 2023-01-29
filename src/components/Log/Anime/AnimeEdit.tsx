import { type FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { getImageByTitle } from "@/utils/animeInfo";
import dayjs from "dayjs";

import { MdCancel } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import ListInput from "./AnimeListInput";
import { type Anime } from "@/types/Anime";
import ErrorAlert from "@/components/Util/ErrorAlert";
import ToggleButton from "@/components/Util/ToggleButton";

const IMAGE_HEIGHT = 315;
const IMAGE_WIDTH = 225;
const IMAGE_SEARCH_TIMEOUT = 1000;

interface Props {
    isOpen: boolean;
    initialAnime?: Anime;
    onCancelButtonClick: () => void;
    onSaveButtonClick: (updatedAnime: Anime) => Promise<{
        success: boolean;
        error?: string;
    }>;
}

const AnimeEdit: React.FC<Props> = ({
    isOpen,
    initialAnime = {} as Anime,
    onCancelButtonClick,
    onSaveButtonClick,
}) => {
    // use ref to avoid call of useEffect on every rerender
    const initialAnimeRef = useRef(initialAnime);

    const [anime, setAnime] = useState(initialAnime);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const [imageSearchTimeout, setimageSearchTimeout] = useState<
        NodeJS.Timeout | undefined
    >();

    useEffect(() => {
        // set current anime to the anime given via initalAnime
        setAnime(initialAnimeRef.current);
    }, [initialAnimeRef]);

    function updateArray(arrayName: string, array: number[]) {
        setAnime((prevAnime) => ({
            ...prevAnime,
            [arrayName]: array,
        }));
    }

    async function updateImage(title: string, isManga: boolean) {
        const image = await getImageByTitle(title, isManga);
        setAnime((prev) => ({ ...prev, imageUrl: image }));
    }

    function handleTypeToggle(isManga: boolean) {
        setAnime((prev) => ({
            ...prev,
            isManga: isManga,
        }));
        if (!anime.hasCustomImage && anime.title)
            void updateImage(anime.title, isManga);
    }

    function handleImageSearchToggle(enabled: boolean) {
        if (!enabled && anime.title)
            void updateImage(anime.title, anime.isManga);
        else clearTimeout(imageSearchTimeout);

        setAnime((prev) => ({ ...prev, hasCustomImage: enabled }));
    }

    // wait without input in the title field before fetching new image
    function handleImageSearchTimeout(title: string) {
        if (!anime.hasCustomImage) {
            clearTimeout(imageSearchTimeout);
            setimageSearchTimeout(
                setTimeout(() => {
                    if (title) void updateImage(title, anime.isManga);
                }, IMAGE_SEARCH_TIMEOUT)
            );
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        const result = await onSaveButtonClick(anime);
        if (result.success) {
            setAnime({} as Anime);
            setError(undefined);
        } else setError(result.error);
        setLoading(false);
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                onClose={() => {
                    setAnime({} as Anime);
                    onCancelButtonClick();
                }}
            >
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/60"
                        aria-hidden="true"
                    />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* Full-screen container to center the panel */}
                    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
                        <Dialog.Panel className="w-4/5 rounded bg-gray-200 p-4 shadow-md  shadow-gray-600 dark:bg-slate-900 md:w-3/5 lg:w-3/6">
                            <Dialog.Title className="flex items-start justify-between border-b border-black px-4 pb-2 dark:border-white">
                                {/* Title */}
                                <span className="text-xl font-semibold">
                                    {initialAnime.id
                                        ? `Update ${
                                              anime.isManga ? "Manga" : "Anime"
                                          }`
                                        : `Add ${
                                              anime.isManga ? "Manga" : "Anime"
                                          }`}
                                </span>
                                {/* Close button */}
                                <button
                                    type="button"
                                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => {
                                        setAnime({} as Anime);
                                        onCancelButtonClick();
                                    }}
                                >
                                    <MdCancel className="text-xl" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </Dialog.Title>

                            {/* Error message */}
                            {error && (
                                <div className="mt-2">
                                    <ErrorAlert message={error} />
                                </div>
                            )}

                            <form
                                className="flex flex-col"
                                onSubmit={(e) => void handleSubmit(e)}
                            >
                                <section className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <div>
                                        {/* Anime-Manga toggle */}
                                        <ToggleButton
                                            initialValue={anime.isManga}
                                            onValueChange={handleTypeToggle}
                                            label="Type"
                                            valueLeft="Anime"
                                            valueRight="Manga"
                                        />
                                        {/* Image */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            className="mx-auto shadow shadow-gray-400"
                                            src={
                                                anime.imageUrl ||
                                                "placeholder.jpg"
                                            }
                                            alt={anime.title}
                                            height={IMAGE_HEIGHT}
                                            width={IMAGE_WIDTH}
                                        />
                                    </div>
                                    <div className="w-full">
                                        {/* Title */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor="title"
                                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Title"
                                                defaultValue={anime.title ?? ""}
                                                maxLength={250}
                                                required
                                                onChange={(e) => {
                                                    setAnime((prevAnime) => ({
                                                        ...prevAnime,
                                                        title: e.target.value,
                                                    }));
                                                    handleImageSearchTimeout(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                        {/* Rating */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor="rating"
                                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Rating:{" "}
                                                <b>{anime.rating ?? 5}</b>
                                            </label>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold">
                                                    0
                                                </span>
                                                <input
                                                    id="rating"
                                                    type="range"
                                                    className="mx-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-50 dark:bg-gray-700"
                                                    min="0"
                                                    max="11"
                                                    defaultValue={
                                                        anime.rating ?? 5
                                                    }
                                                    step="1"
                                                    required
                                                    onChange={(e) =>
                                                        setAnime(
                                                            (prevAnime) => ({
                                                                ...prevAnime,
                                                                rating: parseInt(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            })
                                                        )
                                                    }
                                                />
                                                <span className="text-sm font-semibold">
                                                    11
                                                </span>
                                            </div>
                                        </div>
                                        {/* Automatic Image Search Toggle */}
                                        <ToggleButton
                                            initialValue={
                                                anime.hasCustomImage || false
                                            }
                                            onValueChange={
                                                handleImageSearchToggle
                                            }
                                            label="Image"
                                            valueLeft="Automatic"
                                            valueRight="Manual"
                                        />
                                        {/* Image Url */}
                                        <Transition
                                            as="div"
                                            className="mb-4"
                                            show={anime.hasCustomImage || false}
                                            enter="ease-out duration-200"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <input
                                                type="url"
                                                id="imageUrl"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Image URL"
                                                defaultValue={
                                                    anime.imageUrl ?? ""
                                                }
                                                maxLength={512}
                                                disabled={!anime.hasCustomImage}
                                                onChange={(e) =>
                                                    setAnime((prevAnime) => ({
                                                        ...prevAnime,
                                                        imageUrl:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </Transition>
                                        {/* Link */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor="link"
                                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Link
                                            </label>
                                            <input
                                                type="url"
                                                id="link"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Link to e.g. Crunchyroll"
                                                defaultValue={anime.link ?? ""}
                                                maxLength={512}
                                                onChange={(e) =>
                                                    setAnime((prevAnime) => ({
                                                        ...prevAnime,
                                                        link: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        {/* Start Date */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor="startDate"
                                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                defaultValue={
                                                    anime.startDate
                                                        ? dayjs(
                                                              anime.startDate
                                                          ).format("YYYY-MM-DD")
                                                        : undefined
                                                }
                                                onChange={(e) =>
                                                    setAnime((prevAnime) => ({
                                                        ...prevAnime,
                                                        startDate: new Date(
                                                            e.target.value
                                                        ),
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>
                                {/* Notes */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="notes"
                                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Notes"
                                        defaultValue={anime.note ?? ""}
                                        maxLength={1000}
                                        rows={2}
                                        onChange={(e) =>
                                            setAnime((prevAnime) => ({
                                                ...prevAnime,
                                                note: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                {/* Seasons, Movies ans OVAs input */}
                                <div className="mb-4 flex flex-col divide-black dark:divide-white sm:flex-row sm:divide-x">
                                    <div className="basis-1/3 p-2">
                                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Seasons
                                        </div>
                                        <ListInput
                                            initialArray={anime.seasons ?? []}
                                            onArrayChange={(a) =>
                                                updateArray("seasons", a)
                                            }
                                        />
                                    </div>
                                    <div className="basis-1/3 p-2">
                                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Movies
                                        </div>
                                        <ListInput
                                            initialArray={anime.movies ?? []}
                                            onArrayChange={(a) =>
                                                updateArray("movies", a)
                                            }
                                        />
                                    </div>
                                    <div className="basis-1/3 p-2">
                                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            OVAs
                                        </div>
                                        <ListInput
                                            initialArray={anime.ovas ?? []}
                                            onArrayChange={(a) =>
                                                updateArray("ovas", a)
                                            }
                                        />
                                    </div>
                                </div>
                                {/* Save button */}
                                <button
                                    type="submit"
                                    className="rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                aria-hidden="true"
                                                role="status"
                                                className="mr-3 inline h-4 w-4 animate-spin text-white"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="#E5E7EB"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            Loading...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default AnimeEdit;
