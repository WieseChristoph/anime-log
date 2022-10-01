import { ChartData, ChartOptions } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
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
        const titles: string[] = [];
        let count = 0;

        // Anime array needs to be sorted by start date
        anime.forEach((a) => {
            count += 1;
            if (a.startDate) {
                const date = moment.utc(a.startDate).startOf("day");
                dates.push(date);
                counts.push(count);
                titles.push(a.title);
            }
        });

        return { dates, counts, titles };
    }, [anime]);

    const chartData: ChartData<"line"> = {
        labels: data.dates,
        datasets: [
            {
                data: data.counts,
                backgroundColor: "rgb(222, 66, 91)",
                borderColor: "rgb(72, 143, 49)",
                pointRadius: 4,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        scales: {
            xAxes: {
                title: {
                    display: true,
                    text: "Date",
                },
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
                    title: (tooltipItem) => {
                        const index = tooltipItem.at(0)?.dataIndex ?? NaN;
                        return `${data.titles.at(index)}\n${
                            tooltipItem.at(0)?.label
                        }`;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} Anime`;
                    },
                },
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                },
                pan: {
                    enabled: true,
                },
            },
        },
    };

    return <Line data={chartData} options={options} plugins={[zoomPlugin]} />;
}

export default AnimeStartDateChart;
