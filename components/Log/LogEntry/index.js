import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ListInput from "./ListInput";

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

	let updateArray = (arrayName, array) => {
		setEntry({
			...entry,
			[arrayName]: array,
		});
	};

	return (
		<form
			className="col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2"
			onSubmit={(e) => {
				e.preventDefault();
				onSaveButtonClick(entry);
				setEdit(false);
			}}
		>
			<div
				className="card bg-dark text-light overflow-auto"
				style={!edit ? { maxHeight: "70vh", minHeight: "100%" } : {}}
			>
				<div className="card-header border-light">
					{/* Rating badge */}
					{!edit && (
						<span className="badge bg-primary float-end">
							Rating: {entry.rating} / 10
						</span>
					)}

					<h5 className="card-title">
						{/* Title or input for title and link */}
						{!edit ? (
							<a
								className="text-decoration-none text-reset"
								target="_blank"
								{...(entry.link && { href: entry.link })}
							>
								{entry.title}
							</a>
						) : (
							<>
								<input
									type="text"
									className="form-control"
									placeholder="Title"
									defaultValue={entry.title || ""}
									required
									maxLength="250"
									onChange={(e) =>
										setEntry({
											...entry,
											title: e.target.value,
										})
									}
								/>
								<input
									type="text"
									className="form-control mt-1"
									placeholder="Link to e.g. Crunchyroll"
									defaultValue={entry.link || ""}
									maxLength="500"
									onChange={(e) =>
										setEntry({
											...entry,
											link: e.target.value,
										})
									}
								/>
							</>
						)}
					</h5>

					<h6 className="card-subtitle">
						<span className="text-muted">
							{/* Startdate or input for startdate */}
							{!edit ? (
								entry?.startDate ? (
									moment(entry.startDate).format("DD.MM.yyyy")
								) : (
									"-"
								)
							) : (
								<div className="form-floating  text-dark">
									<input
										type="date"
										id="startDateInput"
										className="form-control"
										defaultValue={
											entry.startDate
												? moment(
														entry.startDate
												  ).format("yyyy-MM-DD")
												: null
										}
										onChange={(e) =>
											setEntry({
												...entry,
												startDate: new Date(
													e.target.value
												),
											})
										}
									/>
									<label htmlFor="startDateInput">
										Start Date
									</label>
								</div>
							)}
						</span>
					</h6>

					{/* Rating input */}
					{edit && (
						<div className="input-group mt-auto">
							<label className="input-group-text">Rating</label>
							<input
								type="number"
								className="form-control"
								defaultValue={entry.rating || 0}
								required
								min="0"
								max="11"
								onChange={(e) =>
									setEntry({
										...entry,
										rating: parseInt(e.target.value),
									})
								}
							></input>
						</div>
					)}
				</div>

				{/* Lists of seasons, movies and ovas or their inputs */}
				<ul className="list-group list-group-flush border-light">
					<li className="list-group-item bg-dark text-light border-light">
						<h6>Season:</h6>
						{!edit ? (
							entry.season?.join(", ")
						) : (
							<ListInput
								initialArray={entry.season || []}
								onArrayChange={(a) => updateArray("season", a)}
							/>
						)}
					</li>
					<li className="list-group-item bg-dark text-light border-light">
						<h6>Movie:</h6>
						{!edit ? (
							entry.movie?.join(", ")
						) : (
							<ListInput
								initialArray={entry.movie || []}
								onArrayChange={(a) => updateArray("movie", a)}
							/>
						)}
					</li>
					<li className="list-group-item bg-dark text-light">
						<h6>OVA:</h6>
						{!edit ? (
							entry.ova?.join(", ")
						) : (
							<ListInput
								initialArray={entry.ova || []}
								onArrayChange={(a) => updateArray("ova", a)}
							/>
						)}
					</li>
				</ul>

				<div
					className="card-body d-flex flex-column overflow-auto"
					style={edit ? { minHeight: "7vh" } : {}}
				>
					{/* Note or input for note and save, cancel buttons */}
					{!edit ? (
						<>
							<h6>Note:</h6>
							<small>{entry.note}</small>
						</>
					) : (
						<>
							<textarea
								className="form-control mb-2"
								placeholder="Note"
								defaultValue={entry.note || ""}
								maxLength="1000"
								onChange={(e) =>
									setEntry({
										...entry,
										note: e.target.value,
									})
								}
							/>
							<div className="btn-group mt-auto">
								<button
									type="button"
									className="btn btn-outline-danger me-2"
									onClick={() =>
										lockEdit
											? onCancelButtonClick()
											: setEdit(!edit)
									}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-outline-success"
								>
									Save
								</button>
							</div>
						</>
					)}
				</div>

				{/* Last updated and edit, delete buttons */}
				{!edit && (
					<div className="card-footer mt-auto">
						{!isSharedLog && (
							<div className="text-center my-1">
								<div className="btn-group" role="group">
									<button
										type="button"
										className="btn btn-outline-warning me-2"
										onClick={() => setEdit(!edit)}
									>
										Edit
									</button>
									<button
										type="button"
										className="btn btn-outline-danger"
										onClick={() =>
											window.confirm(
												"Delete " + entry.title + "?"
											) && onDeleteButtonClick(entry)
										}
									>
										Delete
									</button>
								</div>
							</div>
						)}
						<small className="text-muted">
							Last updated:
							{moment(entry.lastUpdate).format(
								" DD.MM.yyyy HH:mm:ss"
							)}
						</small>
					</div>
				)}
			</div>
		</form>
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
