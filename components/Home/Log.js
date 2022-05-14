import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import LogEntry from "./LogEntry";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const emptyEntry = {
	title: "",
	season: [],
	movie: [],
	ova: [],
	rating: 0,
	link: null,
	note: null,
	startDate: null,
};

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
	const [searchTerm, setSearchTerm] = useState();
	const [showEmptyEntry, setShowEmptyEntry] = useState(false);

	// if share id is defined, get shared log. else get user log
	const { data: entries, mutate } = useSWR(
		shareId ? `/api/sharedLog/getLog?shareId=${shareId}` : "/api/log"
	);
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

	const createEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "PUT",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutate([...entries, data]))
			.catch((error) => console.error(error.message));

		setShowEmptyEntry(false);
	};

	const updateEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "PATCH",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) =>
				mutate(
					entries.map((anime) =>
						anime.id === data.id ? data : anime
					)
				)
			)
			.catch((error) => console.error(error.message));
	};

	const deleteEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "DELETE",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) =>
				mutate(entries.filter((anime) => anime !== data.id))
			)
			.catch((error) => console.error(error.message));
	};

	return (
		<div className="container-fluid px-5 py-3">
			{/* Entry count */}
			<h6 className="text-light">Showing {entries.length} entries</h6>

			<div className="row g-4">
				{/* Selection of entry order and search box */}
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<button
							className={
								"nav-link " +
								(order == orderBy.title
									? "active"
									: "text-light")
							}
							onClick={() => setOrder(orderBy.title)}
						>
							Order by Title
						</button>
					</li>
					<li className="nav-item">
						<button
							className={
								"nav-link " +
								(order == orderBy.rating
									? "active"
									: "text-light")
							}
							onClick={() => setOrder(orderBy.rating)}
						>
							Order by Rating
						</button>
					</li>
					<li className="nav-item">
						<button
							className={
								"nav-link " +
								(order == orderBy.startDate
									? "active"
									: "text-light")
							}
							onClick={() => setOrder(orderBy.startDate)}
						>
							Order by Startdate
						</button>
					</li>
					<li className="nav-item">
						<button
							className={
								"nav-link " +
								(order == orderBy.lastUpdate
									? "active"
									: "text-light")
							}
							onClick={() => setOrder(orderBy.lastUpdate)}
						>
							Order by last Update
						</button>
					</li>
					<li className="nav-item ms-auto">
						<input
							type="search"
							className="form-control"
							placeholder="Search..."
							aria-label="Search"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</li>
				</ul>

				{/* Empty entry or add button */}
				{!shareId ? (
					showEmptyEntry ? (
						<LogEntry
							initialEntry={emptyEntry}
							onSaveButtonClick={(entry) => createEntry(entry)}
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
					)
				) : (
					""
				)}

				{/* All entries */}
				{entries.map((entry) => (
					<LogEntry
						key={entry.id}
						initialEntry={entry}
						onDeleteButtonClick={(entry) => deleteEntry(entry)}
						onSaveButtonClick={(entry) => updateEntry(entry)}
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
