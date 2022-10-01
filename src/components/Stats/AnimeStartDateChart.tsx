// TODO: change to individual imports for smaller bundle (https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking)
import "chart.js/auto";
import { ChartData, ChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import moment from "moment";
import { Anime } from "@/types/Anime";

function AnimeStartDateChart({ anime = [] }: { anime?: Anime[] }) {
    const { theme } = useTheme();

    const data = useMemo(() => {
        const dates: moment.Moment[] = [];
        const counts: number[] = [];
        let count = 0;

        // Anime array needs to be sorted by start date
        anime.forEach((a) => {
            count += 1;
            if (a.startDate) {
                const date = moment.utc(a.startDate).startOf("day");
                dates.push(date);
                counts.push(count);
            }
        });

        return { dates, counts };
    }, [anime]);

    const chartData: ChartData<"line"> = {
        labels: data.dates,
        datasets: [
            {
                data: data.counts,
                backgroundColor: "rgb(222, 66, 91, 0.7)",
                borderColor: "rgb(72, 143, 49)",
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        scales: {
            xAxes: {
                type: "time",
                time: {
                    tooltipFormat: "DD/MM/YYYY",
                },
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

    return <Line data={chartData} options={options} />;
}

export default AnimeStartDateChart;
