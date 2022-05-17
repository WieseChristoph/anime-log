import useSavedSharedLog from "./useSavedSharedLog";
import PropTypes from "prop-types";
import Link from "next/link";

const SavedLogsDropdown = ({ urlShareId }) => {
	const { savedSharedLogs, addSavedSharedLog, deleteSavedSharedLog } =
		useSavedSharedLog();

	return (
		<li className="nav-item dropdown">
			<a
				className="nav-link text-light dropdown-toggle"
				id="savedLogsDropdown"
				role="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				Saved Logs
			</a>
			<ul
				className="dropdown-menu dropdown-menu-dark"
				aria-labelledby="savedLogsDropdown"
			>
				{/* List of saved shared logs */}
				{savedSharedLogs?.length > 0 ? (
					savedSharedLogs.map((sharedLog) => (
						<li key={sharedLog.shareId}>
							<Link href={`/${sharedLog.shareId}`}>
								<a className="dropdown-item">
									{sharedLog.username}
								</a>
							</Link>
						</li>
					))
				) : (
					<li key="noSavedLogs">
						<span className="dropdown-item"> No saved logs</span>
					</li>
				)}

				<li key="divider">
					<hr className="dropdown-divider" />
				</li>

				{/* Add or delete saved shared log buttons */}
				{urlShareId && savedSharedLogs && (
					<li key="buttons">
						{savedSharedLogs.find(
							(sharedLog) => sharedLog.shareId === urlShareId
						) ? (
							<button
								className="dropdown-item"
								onClick={() => deleteSavedSharedLog(urlShareId)}
							>
								Delete current log
							</button>
						) : (
							<button
								className="dropdown-item"
								onClick={() => addSavedSharedLog(urlShareId)}
							>
								Save current log
							</button>
						)}
					</li>
				)}
			</ul>
		</li>
	);
};

SavedLogsDropdown.propTypes = {
	urlShareId: PropTypes.string,
};

export default SavedLogsDropdown;
