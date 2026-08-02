import { useMemo } from 'react';
import type { Anime } from '@/types/anime';
import type { ChartData, ChartOptions } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

type AnimeWeekdayChartPropsType = {
    anime?: Anime[];
};

const AnimeWeekdayChart = ({ anime = [] }: AnimeWeekdayChartPropsType) => {

    const data = useMemo(() => {
        return anime.reduce<number[]>((prev, curr) => {
            if (curr.startDate) {
                const mondayFirstDay = (curr.startDate.getDay() + 6) % 7;
                prev[mondayFirstDay] = (prev[mondayFirstDay] ?? 0) + 1;
            }

            return prev;
        }, []);
    }, [anime]);

    const chartData: ChartData<'bar'> = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgb(222, 66, 91, 0.7)',
                    'rgb(241, 122, 83, 0.7)',
                    'rgb(247, 199, 107, 0.7)',
                    'rgb(207, 211, 117, 0.7)',
                    'rgb(133, 183, 110, 0.7)',
                    'rgb(60, 152, 109, 0.7)',
                    'rgb(72, 143, 49, 0.7)',
                ],
                borderColor: [
                    'rgb(222, 66, 91)',
                    'rgb(241, 122, 83)',
                    'rgb(247, 199, 107)',
                    'rgb(207, 211, 117)',
                    'rgb(133, 183, 110)',
                    'rgb(60, 152, 109)',
                    'rgb(72, 143, 49)',
                ],
                borderRadius: 3,
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Weekday',
                    color: 'rgb(255, 255, 255, 0.7)',
                },
                ticks: {
                    color: 'rgb(255, 255, 255, 0.7)',
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
                    label: (tooltipItem) => {
                        return `${tooltipItem.formattedValue} Anime / Manga`;
                    },
                },
            },
        },
    };

    return <Bar className="chart-canvas" data={chartData} options={options} />;
};

export default AnimeWeekdayChart;
