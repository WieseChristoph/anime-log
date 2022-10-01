import { trpc } from "@/utils/trpc";
import AnimeCountChart from "./AnimeCountChart";
import AnimeRatingChart from "./AnimeRatingChart";
import AnimeStartDateChart from "./AnimeStartDateChart";

function StatsLayout({ shareId }: { shareId?: string }) {
    const getAnime = trpc.useQuery(["anime.get", { shareId: shareId }]);

    return (
        <div className="container mx-auto">
            <div className="my-4 grid grid-cols-2 gap-10">
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">Anime count</span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeCountChart />
                </div>
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">
                        Rating distribution
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeRatingChart anime={getAnime.data} />
                </div>
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">
                        Start date over time
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeStartDateChart />
                </div>
                <div className="rounded bg-gray-200 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">
                        Start date over time
                    </span>
                    <hr className="my-2 border-black dark:border-white" />
                    <AnimeStartDateChart />
                </div>
            </div>
        </div>
    );
}

export default StatsLayout;
