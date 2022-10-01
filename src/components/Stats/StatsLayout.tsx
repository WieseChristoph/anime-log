import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    Tooltip,
} from "chart.js";
import { Order } from "@/types/Order";
import { trpc } from "@/utils/trpc";
import dynamic from "next/dynamic";
import Head from "next/head";
import AnimeRatingChart from "./AnimeRatingChart";
import AnimeWeekdayChart from "./AnimeWeekdayChart";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip
);

// needs dynamic import without ssr because the chart zoom-plugin needs the window object
const DynamicAnimeStartDateChart = dynamic(
    () => import("./AnimeStartDateChart"),
    { ssr: false }
);

function StatsLayout({ shareId }: { shareId?: string }) {
    const getAnime = trpc.useQuery([
        "anime.get",
        { shareId: shareId, order: Order.startDate, asc: true },
    ]);

    const getUserByShareId = trpc.useQuery(
        ["user.get-byShareId", { shareId: shareId as string }],
        { enabled: !!shareId }
    );

    return (
        <div className="container mx-auto">
            {getUserByShareId.data && (
                <>
                    <Head>
                        <title>
                            {getUserByShareId.data.name}&apos;s Stats | Anime
                            Log
                        </title>
                    </Head>
                    <div className="mx-4 mt-4 flex flex-row">
                        <div className="ml-auto mr-2 rounded bg-gradient-to-br from-pink-500 to-orange-400 px-2.5 py-0.5 text-sm font-bold text-white">
                            Stats of
                            <b> {getUserByShareId.data.name}</b>
                        </div>
                    </div>
                </>
            )}

            <div className="m-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">
                        Rating distribution
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeRatingChart anime={getAnime.data} />
                </div>
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">
                        Start date by weekdays
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeWeekdayChart anime={getAnime.data} />
                </div>
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900 md:col-span-2">
                    <span className="text-xl font-bold">
                        Anime count over time
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <DynamicAnimeStartDateChart anime={getAnime.data} />
                </div>
            </div>
        </div>
    );
}

export default StatsLayout;
