import useSavedSharedLog from "../../hooks/useSavedSharedLog";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu } from "@headlessui/react";

const SavedLogsDropdown = ({ urlShareId }) => {
	const { savedSharedLogs, addSavedSharedLog, deleteSavedSharedLog } =
		useSavedSharedLog();

	return (
		<Menu as="div" className="relative inline-block text-left">
			<Menu.Button className="flex items-center">
				Saved Logs
				<svg
					className="w-4 h-4 ml-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</Menu.Button>

			{/* Dropdown menu */}
			<Menu.Items
				className="absolute mt-2 w-52 z-50
			divide-y divide-black dark:divide-white rounded-md text-dark dark:text-white
			bg-white dark:bg-slate-700 shadow-lg"
			>
				<div className="px-1 py-1">
					{savedSharedLogs?.length > 0 ? (
						savedSharedLogs.map((sharedLog) => (
							<Menu.Item key={sharedLog.shareId}>
								<Link href={`/${sharedLog.shareId}`}>
									<a className="flex px-2 py-2 text-sm hover:underline">
										{sharedLog.username}
									</a>
								</Link>
							</Menu.Item>
						))
					) : (
						<Menu.Item key="noSavedLogs">
							<span className="flex px-2 py-2 text-sm hover:underline">
								No saved logs
							</span>
						</Menu.Item>
					)}
				</div>
				{urlShareId && savedSharedLogs && (
					<div className="px-1 py-1">
						<Menu.Item>
							{savedSharedLogs.find(
								(sharedLog) => sharedLog.shareId === urlShareId
							) ? (
								<button
									className="flex px-2 py-2 text-sm hover:underline"
									onClick={() =>
										deleteSavedSharedLog(urlShareId)
									}
								>
									Delete current log
								</button>
							) : (
								<button
									className="flex px-2 py-2 text-sm hover:underline"
									onClick={() =>
										addSavedSharedLog(urlShareId)
									}
								>
									Save current log
								</button>
							)}
						</Menu.Item>
					</div>
				)}
			</Menu.Items>
		</Menu>
	);
};

SavedLogsDropdown.propTypes = {
	urlShareId: PropTypes.string,
};

export default SavedLogsDropdown;
