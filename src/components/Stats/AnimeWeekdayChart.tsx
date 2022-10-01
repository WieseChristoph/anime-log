// TODO: change to individual imports for smaller bundle (https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking)
import "chart.js/auto";
import { ChartData, ChartOptions } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { Anime } from "@/types/Anime";

function AnimeWeekdayChart({ anime = [] }: { anime?: Anime[] }) {
    const { theme } = useTheme();

    const data = useMemo(() => {
        return anime.reduce((prev, curr) => {
            if (curr.startDate) prev[curr.startDate.getDay()] += 1;
            return prev;
        }, Array(7).fill(0));
    }, [anime]);

    const chartData: ChartData<"bar"> = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "rgb(222, 66, 91, 0.7)",
                    "rgb(241, 122, 83, 0.7)",
                    "rgb(247, 199, 107, 0.7)",
                    "rgb(207, 211, 117, 0.7)",
                    "rgb(133, 183, 110, 0.7)",
                    "rgb(60, 152, 109, 0.7)",
                    "rgb(72, 143, 49, 0.7)",
                ],
                borderColor: [
                    "rgb(222, 66, 91)",
                    "rgb(241, 122, 83)",
                    "rgb(247, 199, 107)",
                    "rgb(207, 211, 117)",
                    "rgb(133, 183, 110)",
                    "rgb(60, 152, 109)",
                    "rgb(72, 143, 49)",
                ],
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        scales: {
            xAxes: {
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.2)",
                    }),
                },
            },
            yAxes: {
                ticks: {
                    stepSize: 1,
                },
                grid: {
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
        },
    };

    return <Bar data={chartData} options={options} />;
}

export default AnimeWeekdayChart;
