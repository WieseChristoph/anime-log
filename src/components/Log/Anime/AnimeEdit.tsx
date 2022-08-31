import { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { MdCancel } from "react-icons/md";
import { Dialog, Switch, Transition } from "@headlessui/react";
import ListInput from "./AnimeListInput";
import { Anime } from "@/types/Anime";
import { trpc } from "@/utils/trpc";

const IMAGE_HEIGHT = 315;
const IMAGE_WIDTH = 225;
const IMAGE_SEARCH_TIMEOUT = 1000;

interface Props {
    isOpen: boolean;
    initialAnime?: Anime;
    onCancelButtonClick: () => void;
    onSaveButtonClick: (updatedAnime: Anime) => void;
}

function AnimeEdit({
    isOpen,
    initialAnime = {} as Anime,
    onCancelButtonClick,
    onSaveButtonClick,
}: Props) {
    // use ref to avoid call of useEffect on every rerender
    const initialAnimeRef = useRef(initialAnime);

    const [anime, setAnime] = useState(initialAnime);

    const [searchForImage, setSearchForImage] = useState(
        anime.imageUrl?.includes("media.kitsu.io") ?? true
    );
    const [imageSearchTimeout, setimageSearchTimeout] = useState<
        NodeJS.Timeout | undefined
    >();

    useEffect(() => {
        // set current anime to the anime given via initalAnime
        setAnime(initialAnimeRef.current);
    }, [initialAnimeRef]);

    const getImageByTitle = trpc.useQuery(
        ["kitsu.get-imageByTitle", { title: anime.title }],
        {
            enabled: false,
            onSuccess(data) {
                if (data) setAnime({ ...anime, imageUrl: data });
            },
        }
    );

    function updateArray(arrayName: string, array: number[]) {
        setAnime((prevAnime) => ({
            ...prevAnime,
            [arrayName]: array,
        }));
    }

    function handleImageSearchToggle(enabled: boolean) {
        if (enabled && anime.title) getImageByTitle.refetch();
        else clearTimeout(imageSearchTimeout);

        setSearchForImage(enabled);
    }

    // wait without input in the title field before fetching new image
    function handleImageSearchTimeout(title: string) {
        if (searchForImage) {
            clearTimeout(imageSearchTimeout);
            setimageSearchTimeout(
                setTimeout(
                    () => title && getImageByTitle.refetch(),
                    IMAGE_SEARCH_TIMEOUT
                )
            );
        }
    }

    return (
        // TODO: Transition
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
                    <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
                        <Dialog.Panel className="w-4/5 rounded border border-black bg-gray-200 p-4 dark:border-white dark:bg-slate-900 md:w-3/5 lg:w-3/6">
                            <Dialog.Title className="flex items-start justify-between border-b border-black px-4 pb-2 dark:border-white">
                                <span className="text-xl font-semibold">
                                    {initialAnime.id
                                        ? "Update Anime"
                                        : "Add Anime"}
                                </span>
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

                            <form
                                className="flex flex-col"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSaveButtonClick(anime);
                                    setAnime({} as Anime);
                                }}
                            >
                                <section className="flex flex-col items-center gap-4 pt-4 md:flex-row">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="shadow shadow-gray-400"
                                        src={
                                            anime.imageUrl || "placeholder.jpg"
                                        }
                                        alt={anime.title}
                                        height={IMAGE_HEIGHT}
                                        width={IMAGE_WIDTH}
                                    />
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
                                                Rating: {anime.rating ?? 5}
                                            </label>
                                            <input
                                                id="rating"
                                                type="range"
                                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-50 dark:bg-gray-700"
                                                min="0"
                                                max="11"
                                                defaultValue={anime.rating ?? 5}
                                                step="1"
                                                required
                                                onChange={(e) =>
                                                    setAnime((prevAnime) => ({
                                                        ...prevAnime,
                                                        rating: parseInt(
                                                            e.target.value
                                                        ),
                                                    }))
                                                }
                                            />
                                        </div>
                                        {/* Automatic Image Search Toggle */}
                                        <Switch.Group>
                                            <div className="mb-4 flex items-center">
                                                <Switch.Label className="mr-4">
                                                    Automatic Image Search
                                                </Switch.Label>
                                                <Switch
                                                    checked={searchForImage}
                                                    onChange={
                                                        handleImageSearchToggle
                                                    }
                                                    className={`${
                                                        searchForImage
                                                            ? "bg-blue-600"
                                                            : "bg-gray-200 dark:bg-gray-700"
                                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                                >
                                                    <span
                                                        className={`${
                                                            searchForImage
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                    />
                                                </Switch>
                                            </div>
                                        </Switch.Group>
                                        {/* Image Url */}
                                        <Transition
                                            as="div"
                                            className="mb-4"
                                            show={!searchForImage}
                                            enter="ease-out duration-200"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <label
                                                htmlFor="imageUrl"
                                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Image URL
                                            </label>
                                            <input
                                                type="url"
                                                id="imageUrl"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Image URL"
                                                defaultValue={
                                                    anime.imageUrl ?? ""
                                                }
                                                maxLength={512}
                                                disabled={searchForImage}
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
                                                        ? moment(
                                                              anime.startDate
                                                          ).format("yyyy-MM-DD")
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
                                        rows={1}
                                        onChange={(e) =>
                                            setAnime((prevAnime) => ({
                                                ...prevAnime,
                                                note: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                {/* Seasons, Movies ans OVAs input */}
                                <div className="mb-4 flex flex-col divide-black dark:divide-white md:flex-row md:divide-x">
                                    <div className="basis-1/3 p-2">
                                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Season
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
                                            Movie
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
                                            OVA
                                        </div>
                                        <ListInput
                                            initialArray={anime.ovas ?? []}
                                            onArrayChange={(a) =>
                                                updateArray("ovas", a)
                                            }
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                                >
                                    Save
                                </button>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

AnimeEdit.propTypes = {
    isOpen: PropTypes.bool,
    initialAnime: PropTypes.object,
    onCancelButtonClick: PropTypes.func,
    onSaveButtonClick: PropTypes.func,
};

export default AnimeEdit;
