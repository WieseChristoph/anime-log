import { orderBy } from ".";
import PropTypes from "prop-types";

const SortAndSearchBar = ({ currentOrder, onOrderChange, onSearchChange }) => {
	return (
		<ul className="nav nav-tabs">
			<li className="nav-item">
				<button
					className={
						"nav-link " +
						(currentOrder == orderBy.title
							? "active"
							: "text-light")
					}
					onClick={() => onOrderChange(orderBy.title)}
				>
					Order by Title
				</button>
			</li>
			<li className="nav-item">
				<button
					className={
						"nav-link " +
						(currentOrder == orderBy.rating
							? "active"
							: "text-light")
					}
					onClick={() => onOrderChange(orderBy.rating)}
				>
					Order by Rating
				</button>
			</li>
			<li className="nav-item">
				<button
					className={
						"nav-link " +
						(currentOrder == orderBy.startDate
							? "active"
							: "text-light")
					}
					onClick={() => onOrderChange(orderBy.startDate)}
				>
					Order by Startdate
				</button>
			</li>
			<li className="nav-item">
				<button
					className={
						"nav-link " +
						(currentOrder == orderBy.lastUpdate
							? "active"
							: "text-light")
					}
					onClick={() => onOrderChange(orderBy.lastUpdate)}
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
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</li>
		</ul>
	);
};

SortAndSearchBar.propTypes = {
	currentOrder: PropTypes.string.isRequired,
	onOrderChange: PropTypes.func,
	onSearchChange: PropTypes.func,
};

export default SortAndSearchBar;
