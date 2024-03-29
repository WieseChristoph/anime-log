import { useMemo } from "react";
import { useTheme } from "next-themes";
import { type Anime } from "@/types/Anime";
import { type ChartData, type ChartOptions } from "chart.js/auto";

import { Bar } from "react-chartjs-2";

interface Props {
    anime?: Anime[];
}

const AnimeWeekdayChart: React.FC<Props> = ({ anime = [] }) => {
    const { theme } = useTheme();

    const data = useMemo(() => {
        return anime.reduce((prev, curr) => {
            if (curr.startDate) prev[curr.startDate.getDay()] += 1;
            return prev;
        }, Array<number>(7).fill(0));
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
            x: {
                title: {
                    display: true,
                    text: "Weekday",
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.7)",
                    }),
                },
                ticks: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.7)",
                    }),
                },
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.3)",
                    }),
                },
            },
            y: {
                min: 0,
                title: {
                    display: true,
                    text: "Anime / Manga count",
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.7)",
                    }),
                },
                ticks: {
                    precision: 0,
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.7)",
                    }),
                },
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.3)",
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
                        return `${tooltipItem.formattedValue} Anime / Manga`;
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default AnimeWeekdayChart;
