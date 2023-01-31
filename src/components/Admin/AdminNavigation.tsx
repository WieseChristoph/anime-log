import { type FC } from "react";

export enum AdminNavItem {
    STATS,
    USERS,
}

interface Props {
    active: AdminNavItem;
    onNavItemChange: (newActive: AdminNavItem) => void;
}

const AdminNavigation: FC<Props> = ({ active, onNavItemChange }) => {
    return (
        <div className="border-b border-gray-200 text-center font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {/* Order buttons */}
            <ul className="flex flex-wrap text-xs sm:text-base ">
                <li className="mr-2">
                    <button
                        onClick={() => onNavItemChange(AdminNavItem.STATS)}
                        className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                            active === AdminNavItem.STATS
                                ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Stats
                    </button>
                </li>
                <li className="mr-2">
                    <button
                        onClick={() => onNavItemChange(AdminNavItem.USERS)}
                        className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                            active === AdminNavItem.USERS
                                ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Users
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AdminNavigation;
