import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Image from "next/image";
import { MdCancel, MdSave } from "react-icons/md";
import ListInput from "./ListInput";
import placeholderImage from "../../../public/placeholder.jpg";

const IMAGE_HEIGHT = 210;
const IMAGE_WIDTH = 150;

const LogEntryEdit = ({
	initialEntry,
	onCancelButtonClick,
	onSaveButtonClick,
}) => {
	const [entry, setEntry] = useState(initialEntry || {});

	let updateArray = (arrayName, array) => {
		setEntry({
			...entry,
			[arrayName]: array,
		});
	};

	return (
		<form
			className={`relative rounded-md
            bg-slate-200 dark:bg-slate-900 text-black dark:text-white
			shadow-sm shadow-gray-800 dark:shadow-slate-500`}
			onSubmit={(e) => {
				e.preventDefault();
				onSaveButtonClick(entry);
			}}
		>
			<div className="flex flex-col sm:flex-row">
				{/* Image */}
				<a
					className={`flex-none self-center block shadow-md shadow-black dark:shadow-gray-400 h-[${IMAGE_HEIGHT}px] w-[${IMAGE_WIDTH}px]`}
					target="_blank"
					{...(entry.link && { href: entry.link })}
				>
					<Image
						src={
							entry.kitsuId
								? `https://media.kitsu.io/anime/poster_images/${entry.kitsuId}/small.jpg`
								: placeholderImage
						}
						alt={entry.title}
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
							<div className="flex">
								{/* Title */}
								<input
									type="text"
									id="title"
									className="text-sm w-full rounded-md p-1.5 bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
									placeholder="Title"
									defaultValue={entry.title || ""}
									maxLength="250"
									required
									onChange={(e) =>
										setEntry({
											...entry,
											title: e.target.value,
										})
									}
								/>
								{/* Rating */}
								<div className="font-bold bg-gradient-to-br from-pink-500 to-orange-400 text-white text-sm mx-2 px-2.5 py-0.5 rounded whitespace-nowrap">
									<input
										type="number"
										id="rating"
										className="w-10 text-sm p-1 mr-1 rounded-md bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
										defaultValue={entry.rating || 0}
										min="0"
										max="11"
										required
										onChange={(e) =>
											setEntry({
												...entry,
												rating: parseInt(
													e.target.value
												),
											})
										}
									/>
									/ 10
								</div>
							</div>
							{/* Link */}
							<input
								type="text"
								id="link"
								className="text-sm w-full mt-1 rounded-md p-1.5 bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
								placeholder="Link to e.g. Crunchyroll"
								defaultValue={entry.link || ""}
								maxLength="500"
								required
								onChange={(e) =>
									setEntry({
										...entry,
										link: e.target.value,
									})
								}
							/>
							{/* Start date */}
							<div className="flex flex-row items-center mt-1">
								<label
									htmlFor="date"
									className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Start date
								</label>
								<input
									type="date"
									id="date"
									className="text-sm p-1 mr-1 rounded-md bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
									defaultValue={
										entry.startDate
											? moment(entry.startDate).format(
													"yyyy-MM-DD"
											  )
											: null
									}
									onChange={(e) =>
										setEntry({
											...entry,
											startDate: new Date(e.target.value),
										})
									}
								/>
							</div>

							<hr className="mt-1 border-black dark:border-white" />
						</div>
						{/* Notes */}
						<div className="pt-1 overflow-y-auto">
							<label
								htmlFor="notes"
								className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Notes
							</label>
							<textarea
								id="notes"
								className="p-2.5 w-full text-sm rounded-lg border text-gray-900 bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
								placeholder="Notes"
								defaultValue={entry.note || ""}
								maxLength="1000"
								rows="1"
								onChange={(e) =>
									setEntry({
										...entry,
										note: e.target.value,
									})
								}
							/>
						</div>
					</div>

					{/* Season, Movie, OVA */}
					<div className="flex flex-col border-l border-black dark:border-white px-2">
						<div className="basis-1/3">
							<div className="font-semibold mr-2">Season</div>
							<ListInput
								initialArray={entry.season || []}
								onArrayChange={(a) => updateArray("season", a)}
							/>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">Movie</div>
							<ListInput
								initialArray={entry.movie || []}
								onArrayChange={(a) => updateArray("movie", a)}
							/>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">OVA</div>
							<ListInput
								initialArray={entry.ova || []}
								onArrayChange={(a) => updateArray("ova", a)}
							/>
						</div>
					</div>
				</div>
			</div>
			{/* Cancel and Save Button */}
			<div className="columns-1 absolute top-1 right-1">
				<button
					onClick={onCancelButtonClick}
					className="h-[24px] w-[24px] flex justify-center items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 text-sm hover:text-md rounded-full"
				>
					<MdCancel />
				</button>
				<button
					onClick={() => onSaveButtonClick(entry)}
					className="my-1 h-[24px] w-[24px] flex justify-center items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 text-sm hover:text-md rounded-full"
				>
					<MdSave />
				</button>
			</div>
		</form>
	);
};

LogEntryEdit.propTypes = {
	initialEntry: PropTypes.object,
	onCancelButtonClick: PropTypes.func,
	onSaveButtonClick: PropTypes.func,
};

export default LogEntryEdit;
