import { ChartData, ChartOptions } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";
import { Anime } from "@/types/Anime";

function AnimeWatchtypeChart({ anime = [] }: { anime?: Anime[] }) {
    const data = useMemo(() => {
        return anime.reduce((prev, curr) => {
            prev[0] += curr.seasons.length;
            prev[1] += curr.movies.length;
            prev[2] += curr.ovas.length;
            return prev;
        }, Array(3).fill(0));
    }, [anime]);

    const chartData: ChartData<"doughnut"> = {
        labels: ["Seasons", "Movies", "OVAs"],
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "rgb(222, 66, 91, 0.7)",
                    "rgb(207, 211, 117, 0.7)",
                    "rgb(72, 143, 49, 0.7)",
                ],
                borderColor: [
                    "rgb(222, 66, 91)",
                    "rgb(207, 211, 117)",
                    "rgb(72, 143, 49)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<"doughnut"> = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItem) => {
                        return `${tooltipItem.at(0)?.label}`;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} Anime`;
                    },
                },
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
}

export default AnimeWatchtypeChart;
