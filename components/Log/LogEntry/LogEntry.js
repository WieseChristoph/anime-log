import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Image from "next/image";

const LogEntry = ({
	initialEntry,
	onDeleteButtonClick,
	onSaveButtonClick,
	onCancelButtonClick,
	lockEdit = false,
	isSharedLog = false,
}) => {
	const [edit, setEdit] = useState(lockEdit);
	const [entry, setEntry] = useState(initialEntry || {});

	return (
		<div
			className="grid grid-cols-[150px_auto_35%] h-[210px] rounded-md overflow-hidden
            bg-slate-200 dark:bg-slate-900 text-black dark:text-white
			shadow-sm shadow-gray-800 dark:shadow-slate-500"
		>
			{/* Column 1 */}
			<a
				className="shadow-md shadow-black dark:shadow-gray-400"
				target="_blank"
				{...(entry.link && { href: entry.link })}
			>
				<Image
					src={`https://media.kitsu.io/anime/poster_images/${entry.kitsuId}/small.jpg`}
					alt={entry.title}
					layout="fixed"
					width={150}
					height={210}
				/>
			</a>
			{/* Column 2 */}
			<div className="grid grid-rows-[auto_80%] px-3 pt-2 overflow-auto">
				<div>
					<span className="float-right font-bold bg-gradient-to-br from-pink-500 to-orange-400 text-white text-sm mr-2 px-2.5 py-0.5 rounded">
						{entry.rating} / 10
					</span>
					<h2 className="font-bold">{entry.title}</h2>
					<hr className="border-black dark:border-white my-2" />
				</div>
				<span>{entry.note}</span>
			</div>
			{/* Column 3 */}
			<div className="grid grid-rows-3 border-l border-black dark:border-white pl-2">
				<div className="overflow-x-auto">
					<h2 className="font-semibold">Season</h2>
					<div className="line">{entry.season?.join(", ")}</div>
				</div>
				<div className="overflow-x-auto">
					<hr className="border-black dark:border-white" />
					<h2 className="font-semibold">Movie</h2>
					<span>{entry.movie?.join(", ")}</span>
				</div>
				<div className="overflow-x-auto">
					<hr className="border-black dark:border-white" />
					<h2 className="font-semibold">OVA</h2>
					<span>
						{entry.ova?.join(", ")}1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2,
						3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9
					</span>
				</div>
			</div>
		</div>
	);
};

LogEntry.propTypes = {
	initialEntry: PropTypes.object,
	onDeleteButtonClick: PropTypes.func,
	onSaveButtonClick: PropTypes.func,
	onCancelButtonClick: PropTypes.func,
	lockEdit: PropTypes.bool,
	isSharedLog: PropTypes.bool,
};

export default LogEntry;
