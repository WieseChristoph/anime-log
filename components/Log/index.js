import { useState } from "react";
import moment from "moment";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import useLog from "./useLog";
import LogEntry from "./LogEntry";
import SortAndSearchBar from "./SortAndSearchBar";

// somewhat of an enum for order types
export const orderBy = {
	none: "none",
	title: "title",
	startDate: "startDate",
	rating: "rating",
	lastUpdate: "lastUpdate",
};

const Log = ({ shareId }) => {
	const [order, setOrder] = useState(orderBy.title);
	const [searchTerm, setSearchTerm] = useState("");
	const [showEmptyEntry, setShowEmptyEntry] = useState(false);
	const { entries, createEntry, updateEntry, deleteEntry } = useLog(shareId);

	if (!entries)
		return (
			<div className="position-absolute top-50 start-50 translate-middle">
				<h1 className="border border-light text-white p-3">
					Loading...
				</h1>
			</div>
		);
	if (entries.error)
		return <div className="alert alert-danger m-3">{entries.error}</div>;

	// apply order
	if (order)
		switch (order) {
			case orderBy.title:
				entries = entries.sort((a, b) =>
					a.title.localeCompare(b.title)
				);
				break;
			case orderBy.startDate:
				// order by start date asc, if not set its at the bottom
				entries = entries.sort((a, b) =>
					b.startDate
						? moment(b.startDate).valueOf() -
						  moment(a.startDate).valueOf()
						: -1
				);
				break;
			case orderBy.rating:
				entries = entries.sort((a, b) => b.rating - a.rating);
				break;
			case orderBy.lastUpdate:
				entries = entries.sort(
					(a, b) =>
						moment(b.lastUpdate).valueOf() -
						moment(a.lastUpdate).valueOf()
				);
				break;
			default:
				break;
		}

	// apply search term
	if (searchTerm)
		entries = entries.filter((e) =>
			e.title.toLowerCase().includes(searchTerm.toLowerCase())
		);

	return (
		<div className="container-fluid px-5 py-3">
			{/* Entry count */}
			<h6 className="text-light">Showing {entries.length} entries</h6>

			<div className="row g-4">
				{/* Selection of entry order and search box */}
				<SortAndSearchBar
					currentOrder={order}
					onOrderChange={setOrder}
					onSearchChange={setSearchTerm}
				/>

				{/* Empty entry or add button */}
				{!shareId &&
					(showEmptyEntry ? (
						<LogEntry
							onSaveButtonClick={(entry) => {
								createEntry(entry);
								setShowEmptyEntry(false);
							}}
							onCancelButtonClick={() => setShowEmptyEntry(false)}
							lockEdit={true}
						/>
					) : (
						// Add entry card
						<div
							className="col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2"
							style={{ minHeight: "30vh" }}
						>
							<div
								className="bg-dark text-light card d-flex align-items-center justify-content-center"
								style={{ height: "100%", minHeight: "40vh" }}
								onClick={() => setShowEmptyEntry(true)}
							>
								<FontAwesomeIcon
									icon={faCirclePlus}
									className="display-4 text-light"
								/>
							</div>
						</div>
					))}

				{/* All entries */}
				{entries.map((entry) => (
					<LogEntry
						key={entry.id}
						initialEntry={entry}
						onDeleteButtonClick={deleteEntry}
						onSaveButtonClick={updateEntry}
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
