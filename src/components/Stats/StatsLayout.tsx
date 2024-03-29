import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    RadialLinearScale,
    ArcElement,
    TimeScale,
    Tooltip,
    Filler,
    Legend,
} from "chart.js";
import { logOptionsValidator, Order } from "@/types/LogOptions";
import { api } from "@/utils/api";
import dynamic from "next/dynamic";

import Head from "next/head";
import AnimeRatingChart from "./AnimeRatingChart";
import AnimeWeekdayChart from "./AnimeWeekdayChart";
import ErrorAlert from "../Util/ErrorAlert";
import AnimeWatchtypeChart from "./AnimeWatchtypeChart";
import AnimeTitleLenghtTable from "./AnimeTitleLengthTable";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    LineElement,
    PointElement,
    TimeScale,
    ArcElement,
    Tooltip,
    Filler,
    Legend
);

interface Props {
    shareId?: string;
}

// needs dynamic import without ssr because the chart zoom-plugin needs the window object
const DynamicAnimeStartDateChart = dynamic(
    () => import("./AnimeStartDateChart"),
    { ssr: false }
);

const StatsLayout: React.FC<Props> = ({ shareId }) => {
    const logOptions = logOptionsValidator.parse(undefined);
    logOptions.order = Order.START_DATE;
    logOptions.asc = true;

    const getAnime = api.anime.get.useQuery({ shareId: shareId, logOptions });

    const getUserByShareId = api.user.getByShareId.useQuery(
        { shareId: shareId as string },
        { enabled: !!shareId }
    );

    // Error Alert
    if (getAnime.isError || getUserByShareId.isError)
        return (
            <div className="p-5">
                <ErrorAlert
                    message={
                        getAnime.error?.message ||
                        getUserByShareId.error?.message
                    }
                />
            </div>
        );

    // Invalid share id alert
    if (getUserByShareId.isFetched && !getUserByShareId.data)
        return (
            <div className="p-5">
                <ErrorAlert message="No stats with this id" />
            </div>
        );

    return (
        <div className="container mx-auto px-2 py-4">
            {getUserByShareId.data && (
                <>
                    <Head>
                        <title>
                            {getUserByShareId.data.name}&apos;s Stats | Anime
                            Log
                        </title>
                    </Head>
                    <div className="flex flex-row">
                        <Link
                            className="flex flex-row items-center space-x-2"
                            href={`/${shareId ?? ""}`}
                        >
                            <ChevronLeft />
                            <span>Back to log</span>
                        </Link>
                        <div className="ml-auto rounded bg-gradient-to-r from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                            Stats of
                            <b> {getUserByShareId.data.name}</b>
                        </div>
                    </div>
                </>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded border border-gray-300 bg-gray-200 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <span className="text-xl font-bold">
                        Rating distribution
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeRatingChart anime={getAnime.data} />
                </div>
                <div className="rounded border border-gray-300 bg-gray-200 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <span className="text-xl font-bold">
                        Anime / Manga count by weekdays
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeWeekdayChart anime={getAnime.data} />
                </div>
                <div className="rounded border border-gray-300 bg-gray-200 p-4 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
                    <span className="text-xl font-bold">
                        Anime / Manga count over time
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <DynamicAnimeStartDateChart anime={getAnime.data} />
                </div>
                <div className="rounded border border-gray-300 bg-gray-200 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <span className="text-xl font-bold">Watchtype count</span>
                    <hr className="my-2 border-black dark:border-white" />
                    <div className="mx-auto w-2/3">
                        <AnimeWatchtypeChart anime={getAnime.data} />
                    </div>
                </div>
                <div className="rounded border border-gray-300 bg-gray-200 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <span className="text-xl font-bold">
                        Anime / Manga title length
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeTitleLenghtTable anime={getAnime.data} />
                </div>
            </div>
        </div>
    );
};

export default StatsLayout;
