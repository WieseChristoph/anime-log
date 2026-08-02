import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js/auto';
import type { Anime } from '@/types/anime';
import { Doughnut } from 'react-chartjs-2';

type AnimeWatchtypeChartPropsType = {
    anime?: Anime[];
};

const AnimeWatchtypeChart = ({ anime = [] }: AnimeWatchtypeChartPropsType) => {

    const data = useMemo(() => {
        return anime.reduce<number[]>((prev, curr) => {
            prev[0] = (prev[0] ?? 0) + curr.seasons.length;
            prev[1] = (prev[1] ?? 0) + curr.movies.length;
            prev[2] = (prev[2] ?? 0) + curr.ovas.length;

            return prev;
        }, []);
    }, [anime]);

    const chartData: ChartData<'doughnut'> = {
        labels: ['Seasons', 'Movies', 'OVAs'],
        datasets: [
            {
                data: data,
                backgroundColor: ['rgb(222, 66, 91, 0.7)', 'rgb(207, 211, 117, 0.7)', 'rgb(72, 143, 49, 0.7)'],
                borderColor: ['rgb(222, 66, 91)', 'rgb(207, 211, 117)', 'rgb(72, 143, 49)'],
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        color: 'rgb(255, 255, 255, 0.7)',
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItem) => {
                        return `${tooltipItem.at(0)?.label || '?'}`;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} ${tooltipItem.label}`;
                    },
                },
            },
        },
    };

    return <Doughnut className="chart-canvas" data={chartData} options={options} />;
};

export default AnimeWatchtypeChart;
