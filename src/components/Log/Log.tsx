import SortAndSearch from "./SortAndSearch";
import { orderBy } from "./SortAndSearch";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { trpc } from "@/utils/trpc";
import ErrorAlert from "./ErrorAlert";
import Anime from "./Anime/Anime";
import AnimeEdit from "./Anime/AnimeEdit";
import { FaPlus } from "react-icons/fa";

interface Props {
	shareId?: string;
}

const Log = ({ shareId }: Props) => {
	const [order, setOrder] = useState(orderBy.title);
	const [ascending, setAscending] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showEmptyAnime, setShowEmptyAnime] = useState(false);

	const utils = trpc.useContext();

	const getAnime = trpc.useQuery(["anime.get-all", { shareId: shareId }]);

	const addAnime = trpc.useMutation("anime.add", {
		onMutate: async (newAnime) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await utils.cancelQuery(["anime.get-all"]);

			// Snapshot the previous value
			const previousAnime = utils.getQueryData(["anime.get-all"]);

			// Optimistically update to the new value
			utils.setQueryData(
				["anime.get-all"],
				(oldAnime = []) => [...oldAnime, newAnime] as any
			);

			// Return a context object with the snapshotted value
			return { previousAnime };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newAnime, context) => {
			utils.setQueryData(
				["anime.get-all"],
				() => context?.previousAnime ?? []
			);
		},
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["anime.get-all"]);
		},
	});

	const updateAnime = trpc.useMutation("anime.update", {
		onMutate: async (updatedAnime) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await utils.cancelQuery(["anime.get-all"]);

			// Snapshot the previous value
			const previousAnime = utils.getQueryData(["anime.get-all"]);

			// Optimistically update to the new value
			utils.setQueryData(["anime.get-all"], (oldAnime = []) => {
				oldAnime.map((a) =>
					a.id === updatedAnime.id ? updateAnime : a
				);
				return oldAnime;
			});

			// Return a context object with the snapshotted value
			return { previousAnime };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, updatedAnime, context) => {
			utils.setQueryData(
				["anime.get-all"],
				() => context?.previousAnime ?? []
			);
		},
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["anime.get-all"]);
		},
	});

	const deleteAnime = trpc.useMutation("anime.delete", {
		onMutate: async (deletedAnime) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await utils.cancelQuery(["anime.get-all"]);

			// Snapshot the previous value
			const previousAnime = utils.getQueryData(["anime.get-all"]);

			// Optimistically update to the new value
			utils.setQueryData(["anime.get-all"], (oldAnime = []) => {
				oldAnime.filter((a) => a.id !== deletedAnime.id);
				return oldAnime;
			});

			// Return a context object with the snapshotted value
			return { previousAnime };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, deletedAnime, context) => {
			utils.setQueryData(
				["anime.get-all"],
				() => context?.previousAnime ?? []
			);
		},
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["anime.get-all"]);
		},
	});

	const processedLog = useMemo(() => {
		if (!getAnime.data) return [];

		// apply order
		switch (order) {
			case orderBy.title:
				getAnime.data.sort((a, b) =>
					ascending
						? a.title.localeCompare(b.title)
						: b.title.localeCompare(a.title)
				);
				break;
			case orderBy.startDate:
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
			case orderBy.rating:
				getAnime.data.sort((a, b) =>
					ascending ? b.rating - a.rating : a.rating - b.rating
				);
				break;
			case orderBy.updatedAt:
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

	if (getAnime.isLoading)
		return (
			<div className="text-center mt-10">
				<svg
					role="status"
					className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>
		);

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
				<div className="font-bold bg-gradient-to-br from-pink-500 to-orange-400 text-white text-sm mr-2 px-2.5 py-0.5 rounded">
					Showing {processedLog.length} Anime
				</div>
				{/* Add new Anime button */}
				{shareId === undefined && (
					<button
						type="button"
						onClick={() => setShowEmptyAnime(!showEmptyAnime)}
						className="ml-auto font-medium rounded-full text-lg p-2 text-center text-white bg-gradient-to-br from-pink-500 to-orange-400"
					>
						<FaPlus />
					</button>
				)}
			</div>

			{/* Main log grid */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 justify-start">
				{/* Empty entry for new Anime */}
				{showEmptyAnime && (
					<AnimeEdit
						onCancelButtonClick={() => setShowEmptyAnime(false)}
						onSaveButtonClick={(a) => {
							addAnime.mutate(a);
							setShowEmptyAnime(false);
						}}
					/>
				)}
				{/* All entries */}
				{processedLog.map((anime) => (
					<Anime
						key={anime.id}
						initialAnime={anime}
						deleteFunc={(a) => deleteAnime.mutate(a)}
						saveFunc={(a) => updateAnime.mutate(a)}
						isSharedLog={shareId !== undefined}
					/>
				))}
			</div>
		</div>
	);
};

Log.propTypes = {
	shareId: PropTypes.string,
};

export default Log;
