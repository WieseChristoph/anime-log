import { memo, useCallback, useMemo } from 'react';
import { debounce } from '@/utils/helper';
import { type LogOptionsType as LogOptions, type OrderType, OrderValues } from '@/types/log-options';
import { ChevronDown, ChevronUp, ListFilter } from 'lucide-react';

const SEARCH_TIMEOUT = 250;

type LogSortAndSearchPropsType = {
    logOptions: LogOptions;
    onLogOptionsChange: (logOptions: LogOptions) => void;
};

const AscendingIcon = memo(({ ascending }: { ascending: boolean }) =>
    ascending ? <ChevronUp className="ml-1 h-5 w-5" /> : <ChevronDown className="ml-1 h-5 w-5" />,
);

const LogSortAndSearch = ({ logOptions, onLogOptionsChange }: LogSortAndSearchPropsType) => {
    const sortButtonStyle = useCallback(
        (order: OrderType) =>
            `flex items-center p-4 rounded-t-lg border-b-2 border-transparent ${
                logOptions.order === order
                    ? 'active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
            }`,
        [logOptions.order],
    );

    const onOrderButtonClick = useCallback(
        (order: OrderType) => {
            if (logOptions.order === order) {
                onLogOptionsChange({ ...logOptions, asc: !logOptions.asc });
            } else {
                onLogOptionsChange({ ...logOptions, asc: true, order });
            }
        },
        [logOptions, onLogOptionsChange],
    );

    const handleFilterChange = useCallback(
        (field: 'anime' | 'manga', checked: boolean) => {
            if (!checked && logOptions.filter.anime !== logOptions.filter.manga) return;

            onLogOptionsChange({
                ...logOptions,
                filter: {
                    ...logOptions.filter,
                    [field]: checked,
                },
            });
        },
        [logOptions, onLogOptionsChange],
    );

    const handleSearchChange = useMemo(
        () =>
            debounce((searchTerm: string) => {
                onLogOptionsChange({
                    ...logOptions,
                    searchTerm,
                });
            }, SEARCH_TIMEOUT),
        [onLogOptionsChange, logOptions],
    );

    return (
        <div className="flex flex-wrap border-b border-gray-200 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {/* Order buttons */}
            <ul className="order-last flex flex-1 flex-row gap-2 whitespace-nowrap sm:order-first">
                <button
                    type="button"
                    onClick={() => onOrderButtonClick(OrderValues.TITLE)}
                    className={sortButtonStyle(OrderValues.TITLE)}
                    aria-label="Order by title"
                >
                    Title
                    {logOptions.order === OrderValues.TITLE && <AscendingIcon ascending={logOptions.asc} />}
                </button>
                <button
                    type="button"
                    onClick={() => onOrderButtonClick(OrderValues.RATING)}
                    className={sortButtonStyle(OrderValues.RATING)}
                    aria-label="Order by rating"
                >
                    Rating
                    {logOptions.order === OrderValues.RATING && <AscendingIcon ascending={logOptions.asc} />}
                </button>
                <button
                    type="button"
                    onClick={() => onOrderButtonClick(OrderValues.START_DATE)}
                    className={sortButtonStyle(OrderValues.START_DATE)}
                    aria-label="Order by start date"
                >
                    Start date
                    {logOptions.order === OrderValues.START_DATE && <AscendingIcon ascending={logOptions.asc} />}
                </button>
                <button
                    type="button"
                    onClick={() => onOrderButtonClick(OrderValues.UPDATED_AT)}
                    className={sortButtonStyle(OrderValues.UPDATED_AT)}
                    aria-label="Order by last update"
                >
                    Last Update
                    {logOptions.order === OrderValues.UPDATED_AT && <AscendingIcon ascending={logOptions.asc} />}
                </button>
            </ul>

            <div className="flex flex-row flex-wrap items-center gap-4">
                {/* Type filter */}
                <div className="flex flex-row items-center rounded-lg border border-gray-300 bg-gray-200 p-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400">
                    <ListFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div className="flex items-center border-x border-gray-500 px-2 dark:border-gray-400">
                        <input
                            type="checkbox"
                            id="type-anime"
                            checked={logOptions.filter.anime}
                            onChange={(e) => handleFilterChange('anime', e.target.checked)}
                        />
                        <label className="ml-2" htmlFor="type-anime">
                            Anime
                        </label>
                    </div>
                    <div className="flex items-center px-2">
                        <input
                            type="checkbox"
                            id="type-manga"
                            checked={logOptions.filter.manga}
                            onChange={(e) => handleFilterChange('manga', e.target.checked)}
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
                            role="img"
                            aria-label="Search icon"
                        >
                            <title>Search icon</title>
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        name="search"
                        className="w-full rounded-lg border border-gray-300 bg-gray-200 p-2 pl-10 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="Search"
                        value={logOptions.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default LogSortAndSearch;
