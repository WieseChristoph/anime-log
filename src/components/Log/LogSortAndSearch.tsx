import { useMemo } from "react";
import { debounce } from "@/utils/helper";
import { type LogOptions, Order } from "@/types/LogOptions";

import { ChevronDown, ChevronUp, ListFilter } from "lucide-react";

const SEARCH_TIMEOUT = 250;

interface Props {
    logOptions: LogOptions;
    onLogOptionsChange: (logOptions: LogOptions) => void;
}

function AscendingIcon({ ascending }: { ascending: boolean }) {
    return ascending ? (
        <ChevronUp className="ml-1 h-5 w-5" />
    ) : (
        <ChevronDown className="ml-1 h-5 w-5" />
    );
}

const LogSortAndSearch: React.FC<Props> = ({
    logOptions,
    onLogOptionsChange,
}) => {
    const sortButtonStyle = (order: Order) =>
        `flex items-center p-4 rounded-t-lg border-b-2 border-transparent ${
            logOptions.order === order
                ? "active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        }`;

    function onOrderButtonClick(order: Order) {
        if (logOptions.order === order)
            onLogOptionsChange({ ...logOptions, asc: !logOptions.asc });
        else onLogOptionsChange({ ...logOptions, asc: true, order: order });
    }

    const handleSearchChange = useMemo(
        () => debounce((searchTerm: string) => {
            onLogOptionsChange({
                ...logOptions,
                searchTerm,
            });
        }, SEARCH_TIMEOUT),
        [onLogOptionsChange, logOptions]
    );

    return (
        <div className="flex flex-wrap border-b border-gray-200 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {/* Order buttons */}
            <ul className="order-last flex flex-1 flex-row gap-2 whitespace-nowrap sm:order-first">
                <button
                    onClick={() => onOrderButtonClick(Order.TITLE)}
                    className={sortButtonStyle(Order.TITLE)}
                    aria-label="Order by title"
                >
                    Title
                    {logOptions.order === Order.TITLE && (
                        <AscendingIcon ascending={logOptions.asc} />
                    )}
                </button>
                <button
                    onClick={() => onOrderButtonClick(Order.RATING)}
                    className={sortButtonStyle(Order.RATING)}
                    aria-label="Order by rating"
                >
                    Rating
                    {logOptions.order === Order.RATING && (
                        <AscendingIcon ascending={logOptions.asc} />
                    )}
                </button>
                <button
                    onClick={() => onOrderButtonClick(Order.START_DATE)}
                    className={sortButtonStyle(Order.START_DATE)}
                    aria-label="Order by start date"
                >
                    Start date
                    {logOptions.order === Order.START_DATE && (
                        <AscendingIcon ascending={logOptions.asc} />
                    )}
                </button>
                <button
                    onClick={() => onOrderButtonClick(Order.UPDATED_AT)}
                    className={sortButtonStyle(Order.UPDATED_AT)}
                    aria-label="Order by last update"
                >
                    Last Update
                    {logOptions.order === Order.UPDATED_AT && (
                        <AscendingIcon ascending={logOptions.asc} />
                    )}
                </button>
            </ul>

            <div className="flex flex-row flex-wrap items-center gap-4">
                {/* Type filter */}
                <div className="flex flex-row items-center rounded-lg border border-gray-300 bg-gray-200 p-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400">
                    <ListFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div className="flex items-center border-x-[1px] border-gray-500 px-2 dark:border-gray-400">
                        <input
                            type="checkbox"
                            id="type-anime"
                            defaultChecked={logOptions.filter.anime}
                            onChange={(e) =>
                                // check if needed, that one checkmark stays checked
                                !e.target.checked &&
                                logOptions.filter.anime !==
                                    logOptions.filter.manga
                                    ? (e.target.checked = !e.target.checked)
                                    : onLogOptionsChange({
                                          ...logOptions,
                                          filter: {
                                              ...logOptions.filter,
                                              anime: e.target.checked,
                                          },
                                      })
                            }
                        />
                        <label className="ml-2" htmlFor="type-anime">
                            Anime
                        </label>
                    </div>
                    <div className="flex items-center px-2">
                        <input
                            type="checkbox"
                            id="type-manga"
                            defaultChecked={logOptions.filter.manga}
                            onChange={(e) =>
                                // check if needed, that one checkmark stays checked
                                !e.target.checked &&
                                logOptions.filter.anime !==
                                    logOptions.filter.manga
                                    ? (e.target.checked = !e.target.checked)
                                    : onLogOptionsChange({
                                          ...logOptions,
                                          filter: {
                                              ...logOptions.filter,
                                              manga: e.target.checked,
                                          },
                                      })
                            }
                        />
                        <label className="ml-2" htmlFor="type-manga">
                            Manga
                        </label>
                    </div>
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-auto">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full items-center pl-3">
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
                        className="w-full rounded-lg border border-gray-300 bg-gray-200 p-2 pl-10 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="Search"
                        defaultValue={logOptions.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default LogSortAndSearch;
