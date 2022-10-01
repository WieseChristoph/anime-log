import { trpc } from "@/utils/trpc";
import AnimeCountChart from "./AnimeCountChart";
import AnimeRatingChart from "./AnimeRatingChart";
import AnimeStartDateChart from "./AnimeStartDateChart";

function StatsLayout({ shareId }: { shareId?: string }) {
    const getAnime = trpc.useQuery(["anime.get", { shareId: shareId }]);

    return (
        <div className="container mx-auto">
            <div className="my-4 grid grid-cols-2">
                <div>
                    <span>Anime count</span>
                    <AnimeCountChart />
                </div>
                <div>
                    <span>Rating distribution</span>
                    <AnimeRatingChart anime={getAnime.data} />
                </div>
                <div>
                    <span>Start date over time</span>
                    <AnimeStartDateChart />
                </div>
            </div>
        </div>
    );
}

export default StatsLayout;
