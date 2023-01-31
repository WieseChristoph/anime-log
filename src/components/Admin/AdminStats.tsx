import { type FC } from "react";
import { api } from "@/utils/api";

import { MdOutlineSupervisorAccount } from "react-icons/md";
import { FaBook, FaTv } from "react-icons/fa";
import ErrorAlert from "../Util/ErrorAlert";

const AdminStats: FC = () => {
    const getUserCount = api.user.getCount.useQuery();
    const getAnimeMangaCount = api.anime.getCountByType.useQuery();

    // Error Alert
    if (getUserCount.isError || getAnimeMangaCount.isError)
        return (
            <div className="p-5">
                <ErrorAlert
                    message={
                        getAnimeMangaCount.error?.message ||
                        getAnimeMangaCount.error?.message
                    }
                />
            </div>
        );

    return (
        <div className="my-4 grid w-full grid-cols-3 justify-between justify-items-center gap-24">
            {/* User count */}
            <div className="w-full rounded-lg bg-gray-200 p-6 shadow dark:bg-slate-900">
                <span className="flex flex-row items-center gap-4">
                    <MdOutlineSupervisorAccount className="mb-2 h-10 w-10 text-gray-500 dark:text-gray-400" />
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        User count
                    </h5>
                </span>
                <p className="text-center text-6xl font-normal text-gray-500 dark:text-gray-400">
                    {getUserCount.data}
                </p>
            </div>

            {/* Anime count */}
            <div className="w-full rounded-lg bg-gray-200 p-6 shadow dark:bg-slate-900">
                <span className="flex flex-row items-center gap-4">
                    <FaTv className="mb-2 h-10 w-10 text-gray-500 dark:text-gray-400" />
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Anime count
                    </h5>
                </span>
                <p className="text-center text-6xl font-normal text-gray-500 dark:text-gray-400">
                    {
                        getAnimeMangaCount.data?.find((e) => !e.isManga)?._count
                            ._all
                    }
                </p>
            </div>

            {/* Manga count */}
            <div className="w-full rounded-lg bg-gray-200 p-6 shadow dark:bg-slate-900">
                <span className="flex flex-row items-center gap-4">
                    <FaBook className="mb-2 h-10 w-10 text-gray-500 dark:text-gray-400" />
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Manga count
                    </h5>
                </span>
                <p className="text-center text-6xl font-normal text-gray-500 dark:text-gray-400">
                    {
                        getAnimeMangaCount.data?.find((e) => e.isManga)?._count
                            ._all
                    }
                </p>
            </div>
        </div>
    );
};

export default AdminStats;
