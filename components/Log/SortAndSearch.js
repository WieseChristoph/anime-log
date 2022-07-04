import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// somewhat of an enum for order types
export const orderBy = {
	none: "none",
	title: "title",
	startDate: "startDate",
	rating: "rating",
	lastUpdate: "lastUpdate",
};

const AscendingIcon = ({ ascending }) => {
	return ascending ? (
		<FaChevronDown className="text-sm ml-1" />
	) : (
		<FaChevronUp className="text-sm ml-1" />
	);
};

const SortAndSearch = ({
	currentOrder,
	ascending,
	onOrderChange,
	onSearchChange,
	onAscendingChange,
}) => {
	const sortButtonStyle = (order) =>
		`inline-block flex items-center p-4 rounded-t-lg border-b-2 border-transparent ${
			currentOrder === order
				? "active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
				: "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
		}`;

	const onOrderButtonClick = (order) => {
		if (currentOrder === order) onAscendingChange(!ascending);
		else {
			onAscendingChange(true);
			onOrderChange(order);
		}
	};

	return (
		<div className="font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
			{/* Order buttons */}
			<ul className="flex flex-wrap">
				<li className="mr-2">
					<button
						onClick={() => onOrderButtonClick(orderBy.title)}
						className={sortButtonStyle(orderBy.title)}
					>
						Title
						{currentOrder === orderBy.title && (
							<AscendingIcon ascending={ascending} />
						)}
					</button>
				</li>
				<li className="mr-2">
					<button
						onClick={() => onOrderButtonClick(orderBy.rating)}
						className={sortButtonStyle(orderBy.rating)}
					>
						Rating
						{currentOrder === orderBy.rating && (
							<AscendingIcon ascending={ascending} />
						)}
					</button>
				</li>
				<li className="mr-2">
					<button
						onClick={() => onOrderButtonClick(orderBy.startDate)}
						className={sortButtonStyle(orderBy.startDate)}
					>
						Startdate
						{currentOrder === orderBy.startDate && (
							<AscendingIcon ascending={ascending} />
						)}
					</button>
				</li>
				<li className="mr-2">
					<button
						onClick={() => onOrderButtonClick(orderBy.lastUpdate)}
						className={sortButtonStyle(orderBy.lastUpdate)}
					>
						Last Update
						{currentOrder === orderBy.lastUpdate && (
							<AscendingIcon ascending={ascending} />
						)}
					</button>
				</li>

				{/* Search box */}
				<li className="ml-auto flex items-center">
					<div className="relative w-full">
						<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-500 dark:text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								></path>
							</svg>
						</div>
						<input
							type="search"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
							placeholder="Search"
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				</li>
			</ul>
		</div>
	);
};

SortAndSearch.propTypes = {
	currentOrder: PropTypes.string.isRequired,
	ascending: PropTypes.bool.isRequired,
	onOrderChange: PropTypes.func,
	onSearchChange: PropTypes.func,
	onAscendingChange: PropTypes.func,
};

export default SortAndSearch;
