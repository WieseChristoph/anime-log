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
        labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
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
                borderRadius: 3,
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        scales: {
            xAxes: {
                title: {
                    display: true,
                    text: "Weekday",
                },
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.2)",
                    }),
                },
            },
            yAxes: {
                title: {
                    display: true,
                    text: "Anime count",
                },
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
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} Anime`;
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}

export default AnimeWeekdayChart;
