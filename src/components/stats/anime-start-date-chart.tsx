import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js/auto';
import '@/utils/chartjs-dayjs-adapter';
import zoomPlugin from 'chartjs-plugin-zoom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import type { Anime } from '@/types/anime';
import { Line } from 'react-chartjs-2';

type AnimeStartDateChartPropsType = {
    anime?: Anime[];
};

const AnimeStartDateChart = ({ anime = [] }: AnimeStartDateChartPropsType) => {

    const data = useMemo(() => {
        const dates: dayjs.Dayjs[] = [];
        const counts: number[] = [];
        const titles: string[] = [];
        let count = 0;

        // Anime array needs to be sorted by start date
        anime.forEach((a) => {
            if (!a.startDate) return;
            count += 1;
            const date = dayjs.utc(a.startDate).startOf('day');
            dates.push(date);
            counts.push(count);
            titles.push(a.title);
        });

        return { dates, counts, titles };
    }, [anime]);

    const chartData: ChartData<'line'> = {
        labels: data.dates,
        datasets: [
            {
                data: data.counts,
                pointBackgroundColor: 'rgb(222, 66, 91)',
                backgroundColor: 'rgb(72, 143, 49, 0.2)',
                borderColor: 'rgb(72, 143, 49)',
                pointRadius: 4,
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                min: data.dates.at(0)?.valueOf(),
                max: data.dates.at(-1)?.valueOf(),
                title: {
                    display: true,
                    text: 'Date',
                    color: 'rgb(255, 255, 255, 0.7)',
                },
                ticks: {
                    color: 'rgb(255, 255, 255, 0.7)',
                },
                type: 'time',
                time: {
                    tooltipFormat: 'DD/MM/YYYY',
                },
                grid: {
                    color: 'rgb(255, 255, 255, 0.3)',
                },
            },
            y: {
                min: 0,
                title: {
                    display: true,
                    text: 'Anime / Manga count',
                    color: 'rgb(255, 255, 255, 0.7)',
                },
                ticks: {
                    precision: 0,
                    color: 'rgb(255, 255, 255, 0.7)',
                },
                grid: {
                    color: 'rgb(255, 255, 255, 0.3)',
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
                        return `${data.titles.at(index) || '?'}\n${tooltipItem.at(0)?.label || '?'}`;
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

    return <Line className="chart-canvas" data={chartData} options={options} plugins={[zoomPlugin]} />;
};

export default AnimeStartDateChart;
