import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Image from "next/image";
import { MdEdit, MdDelete } from "react-icons/md";
import LogEntryEdit from "./LogEntryEdit";
import placeholderImage from "../../../public/placeholder.jpg";

const IMAGE_HEIGHT = 210;
const IMAGE_WIDTH = 150;

const LogEntry = ({
	initialEntry,
	deleteFunc,
	saveFunc,
	isSharedLog = false,
}) => {
	const [edit, setEdit] = useState(false);
	const [entry, setEntry] = useState(initialEntry || {});

	// Edit entry
	if (edit) {
		return (
			<LogEntryEdit
				initialEntry={entry}
				onSaveButtonClick={(updatedEntry) => {
					saveFunc(updatedEntry);
					setEntry(updatedEntry);
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
					{...(entry.link && { href: entry.link })}
				>
					<Image
						src={entry.image ? entry.image : placeholderImage}
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
							<span className="float-right font-bold bg-gradient-to-br from-pink-500 to-orange-400 text-white text-sm mr-2 px-2.5 py-0.5 rounded">
								{entry.rating} / 10
							</span>
							<div className="font-bold">{entry.title}</div>
							<div className="text-sm dark:text-slate-300">
								{entry.startDate
									? moment(entry.startDate).format(
											"DD.MM.yyyy"
									  )
									: "-"}
							</div>
							<div className="text-xs dark:text-slate-300">
								Last updated:
								{entry.lastUpdate
									? moment(entry.lastUpdate).format(
											" DD.MM.yyyy"
									  )
									: " -"}
							</div>
							<hr className="border-black dark:border-white" />
						</div>
						<div className="pt-1 overflow-y-auto">
							<span className="break-words">{entry.note}</span>
						</div>
					</div>

					{/* Season, Movie, OVA */}
					<div className="flex flex-col border-l border-black dark:border-white px-2">
						<div className="basis-1/3">
							<div className="font-semibold">Season</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{entry.season?.join(", ")}
							</div>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">Movie</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{entry.movie?.join(", ")}
							</div>
						</div>
						<div className="basis-1/3">
							<hr className="border-black dark:border-white" />
							<div className="font-semibold">OVA</div>
							<div className="whitespace-nowrap overflow-x-auto">
								{entry.ova?.join(", ")}
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
							window.confirm("Delete " + entry.title + "?") &&
							deleteFunc(entry)
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

LogEntry.propTypes = {
	initialEntry: PropTypes.object.isRequired,
	deleteFunc: PropTypes.func,
	saveFunc: PropTypes.func,
	isSharedLog: PropTypes.bool,
};

export default LogEntry;
