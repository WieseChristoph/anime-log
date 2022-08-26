import SortAndSearch from "./SortAndSearch";
import { orderBy } from "./SortAndSearch";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { trpc } from "@/utils/trpc";
import ErrorAlert from "../Util/ErrorAlert";
import Anime from "./Anime/Anime";
import AnimeEdit from "./Anime/AnimeEdit";
import { FaPlus } from "react-icons/fa";
import Loading from "../Util/Loading";

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
