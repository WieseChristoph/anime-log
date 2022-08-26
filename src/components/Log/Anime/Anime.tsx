import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Image from "next/image";
import { MdEdit, MdDelete } from "react-icons/md";
import AnimeEdit from "./AnimeEdit";
import placeholderImage from "../../../../public/placeholder.jpg";
import { Anime as AnimeType } from "@/types/Anime";

const IMAGE_HEIGHT = 210;
const IMAGE_WIDTH = 150;

interface Props {
	initialAnime: AnimeType;
	deleteFunc: (anime: AnimeType) => void;
	saveFunc: (anime: AnimeType) => void;
	isSharedLog: boolean;
}

function isConsecutive(array: number[]): boolean {
	const sorted = array.sort((a, b) => a - b);
	for (let i = 0; i < sorted.length - 1; i++) {
		if (sorted[i + 1] !== sorted[i] + 1) {
			return false;
		}
	}
	return true;
}

function arrayToString(array: number[]): string {
	if (isConsecutive(array) && array.length > 1)
		return `${array[0]}-${array[array.length - 1]}`;
	else return array.join(", ");
}

const Anime = ({
	initialAnime,
	deleteFunc,
	saveFunc,
	isSharedLog = false,
}: Props) => {
	const [edit, setEdit] = useState(false);
	const [anime, setAnime] = useState(initialAnime);

	// Edit entry
	if (edit) {
		return (
			<AnimeEdit
				initialAnime={anime}
				onSaveButtonClick={(updatedAnime: AnimeType) => {
					saveFunc(updatedAnime);
					setAnime(updatedAnime);
					setEdit(false);
				}}
				onCancelButtonClick={() => setEdit(false)}
			/>
		);
	}

	return (
		<div
			className={`relative rounded-md
            bg-slate-200 dark:bg-slate-900 text-black dark:text-white
			shadow-sm shadow-gray-800 dark:shadow-slate-500`}
		>
			<div className="flex flex-col sm:flex-row">
				{/* Image */}
				<a
					className="flex-none self-center block shadow-md shadow-black dark:shadow-gray-400 h-[210px] w-[150px]"
					target="_blank"
					{...(anime.link && { href: anime.link })}
				>
					<Image
						src={anime.imageUrl || placeholderImage}
						alt={anime.title}
						layout="intrinsic"
						height={IMAGE_HEIGHT}
						width={IMAGE_WIDTH}
					/>
				</a>

				<div
					className={`flex-1 grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 py-2 h-[${IMAGE_HEIGHT}px]`}
				>
					{/* Title, rating and notes */}
					<div className="flex flex-col px-2 overflow-hidden">
						<div>
							<span className="float-right font-bold bg-gradient-to-br from-pink-500 to-orange-400 text-white text-sm mr-2 px-2.5 py-0.5 rounded">
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
						<div className="pt-1 overflow-y-auto">
							<span className="break-words">{anime.note}</span>
						</div>
					</div>

					{/* Season, Movie, OVA */}
					<div className="flex flex-col border-l border-black dark:border-white px-2">
						<div className="basis-1/3">
							<div className="font-semibold">Season</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{arrayToString(anime.seasons)}
							</div>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">Movie</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{arrayToString(anime.movies)}
							</div>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">OVA</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{arrayToString(anime.ovas)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Edit and Delete Button */}
			{!isSharedLog && (
				<div className="columns-1 absolute top-1 right-1">
					<button
						onClick={() => setEdit(true)}
						className="h-[24px] w-[24px] flex justify-center items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 text-sm hover:text-md rounded-full"
					>
						<MdEdit />
					</button>
					<button
						onClick={() =>
							window.confirm("Delete " + anime.title + "?") &&
							deleteFunc(anime)
						}
						className="my-1 h-[24px] w-[24px] flex justify-center items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 text-sm hover:text-md rounded-full"
					>
						<MdDelete />
					</button>
				</div>
			)}
		</div>
	);
};

Anime.propTypes = {
	initialAnime: PropTypes.object.isRequired,
	deleteFunc: PropTypes.func,
	saveFunc: PropTypes.func,
	isSharedLog: PropTypes.bool,
};

export default Anime;
