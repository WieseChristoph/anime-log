import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Order } from "@/types/Order";

interface Props {
    currentOrder: Order;
    ascending: boolean;
    searchTerm: string;
    onOrderChange: (order: Order) => void;
    onSearchChange: (searchTerm: string) => void;
    onAscendingChange: (ascending: boolean) => void;
}

function AscendingIcon({ ascending }: { ascending: boolean }) {
    return ascending ? (
        <FaChevronDown className="ml-1 text-sm" />
    ) : (
        <FaChevronUp className="ml-1 text-sm" />
    );
}

function LogSortAndSearch({
    currentOrder,
    ascending,
    searchTerm,
    onOrderChange,
    onSearchChange,
    onAscendingChange,
}: Props) {
    const sortButtonStyle = (order: Order) =>
        `inline-block flex items-center p-4 rounded-t-lg border-b-2 border-transparent ${
            currentOrder === order
                ? "active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        }`;

    function onOrderButtonClick(order: Order) {
        if (currentOrder === order) onAscendingChange(!ascending);
        else {
            onAscendingChange(true);
            onOrderChange(order);
        }
    }

    return (
        <div className="border-b border-gray-200 text-center font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {/* Order buttons */}
            <ul className="flex flex-wrap">
                <li className="mr-2">
                    <button
                        onClick={() => onOrderButtonClick(Order.title)}
                        className={sortButtonStyle(Order.title)}
                    >
                        Title
                        {currentOrder === Order.title && (
                            <AscendingIcon ascending={ascending} />
                        )}
                    </button>
                </li>
                <li className="mr-2">
                    <button
                        onClick={() => onOrderButtonClick(Order.rating)}
                        className={sortButtonStyle(Order.rating)}
                    >
                        Rating
                        {currentOrder === Order.rating && (
                            <AscendingIcon ascending={ascending} />
                        )}
                    </button>
                </li>
                <li className="mr-2">
                    <button
                        onClick={() => onOrderButtonClick(Order.startDate)}
                        className={sortButtonStyle(Order.startDate)}
                    >
                        Startdate
                        {currentOrder === Order.startDate && (
                            <AscendingIcon ascending={ascending} />
                        )}
                    </button>
                </li>
                <li className="mr-2">
                    <button
                        onClick={() => onOrderButtonClick(Order.updatedAt)}
                        className={sortButtonStyle(Order.updatedAt)}
                    >
                        Last Update
                        {currentOrder === Order.updatedAt && (
                            <AscendingIcon ascending={ascending} />
                        )}
                    </button>
                </li>

                {/* Search box */}
                <li className="ml-auto flex items-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const searchElement =
                                e.currentTarget.elements.namedItem(
                                    "search"
                                ) as HTMLInputElement;
                            onSearchChange(searchElement.value);
                        }}
                        className="relative w-full"
                    >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
                            name="search"
                            className="rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="Search"
                            defaultValue={searchTerm}
                            onChange={(e) =>
                                // reset on clear
                                !e.target.value &&
                                onSearchChange(e.target.value)
                            }
                        />
                    </form>
                </li>
            </ul>
        </div>
    );
}

LogSortAndSearch.propTypes = {
    currentOrder: PropTypes.string.isRequired,
    ascending: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
    onOrderChange: PropTypes.func,
    onSearchChange: PropTypes.func,
    onAscendingChange: PropTypes.func,
};

export default LogSortAndSearch;
