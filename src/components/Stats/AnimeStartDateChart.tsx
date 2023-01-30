import { useMemo } from "react";
import { useTheme } from "next-themes";
import { type ChartData, type ChartOptions } from "chart.js/auto";
import "@/utils/chartjsDayjsAdapter";
import zoomPlugin from "chartjs-plugin-zoom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { type Anime } from "@/types/Anime";

import { Line } from "react-chartjs-2";

interface Props {
    anime?: Anime[];
}

const AnimeStartDateChart: React.FC<Props> = ({ anime = [] }) => {
    const { theme } = useTheme();

    const data = useMemo(() => {
        const dates: dayjs.Dayjs[] = [];
        const counts: number[] = [];
        const titles: string[] = [];
        let count = 0;

        // Anime array needs to be sorted by start date
        anime.forEach((a) => {
            count += 1;
            if (a.startDate) {
                const date = dayjs.utc(a.startDate).startOf("day");
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
                pointBackgroundColor: "rgb(222, 66, 91)",
                backgroundColor: "rgb(72, 143, 49, 0.2)",
                borderColor: "rgb(72, 143, 49)",
                pointRadius: 4,
                fill: true,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        scales: {
            x: {
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
            y: {
                min: 0,
                title: {
                    display: true,
                    text: "Anime / Manga count",
                },
                ticks: {
                    precision: 0,
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
                        return `${data.titles.at(index) || "?"}\n${
                            tooltipItem.at(0)?.label || "?"
                        }`;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} Anime / Manga in total`;
                    },
                },
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
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
};

export default AnimeStartDateChart;
