import { ChartData, ChartOptions } from "chart.js/auto";
import { Radar } from "react-chartjs-2";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { Anime } from "@/types/Anime";

function AnimeWatchtypeChart({ anime = [] }: { anime?: Anime[] }) {
    const { theme } = useTheme();

    const data = useMemo(() => {
        return anime.reduce((prev, curr) => {
            prev[0] += curr.seasons.length;
            prev[1] += curr.movies.length;
            prev[2] += curr.ovas.length;
            return prev;
        }, Array(3).fill(0));
    }, [anime]);

    const chartData: ChartData<"radar"> = {
        labels: ["Seasons", "Movies", "OVAs"],
        datasets: [
            {
                data: data,
                backgroundColor: "rgb(72, 143, 49, 0.2)",
                borderColor: "rgb(72, 143, 49)",
                borderWidth: 1,
                pointRadius: 5,
                pointBackgroundColor: "rgb(222, 66, 91)",
            },
        ],
    };

    const options: ChartOptions<"radar"> = {
        scales: {
            xAxes: {
                display: false,
            },
            yAxes: {
                display: false,
            },
            r: {
                pointLabels: {
                    font: {
                        size: 15,
                    },
                },
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.2)",
                    }),
                },
                angleLines: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.2)",
                    }),
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
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

    return <Radar data={chartData} options={options} />;
}

export default AnimeWatchtypeChart;
