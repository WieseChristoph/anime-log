import AnimeCountChart from "./AnimeCountChart";
import AnimeRatingChart from "./AnimeRatingChart";
import AnimeStartDateChart from "./AnimeStartDateChart";

function StatsLayout() {
    return (
        <div className="container mx-auto px-5 py-4">
            <div className="my-4 flex flex-row items-center">
                <AnimeCountChart />
                <AnimeRatingChart />
                <AnimeStartDateChart />
            </div>
        </div>
    );
}

export default StatsLayout;
