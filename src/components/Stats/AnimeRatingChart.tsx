// TODO: change to individual imports for smaller bundle (https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking)
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Anime } from "@/types/Anime";
import { useTheme } from "next-themes";

function AnimeRatingChart({ anime = [] }: { anime?: Anime[] }) {
    const { theme } = useTheme();

    function getRatingCount() {
        const ratingCount = Array(12).fill(0);

        for (const a of anime) ratingCount[a.rating] += 1;

        return ratingCount;
    }

    const data = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        datasets: [
            {
                data: getRatingCount(),
                backgroundColor: [
                    "rgb(222, 66, 91, 0.7)",
                    "rgb(233, 95, 85, 0.7)",
                    "rgb(241, 122, 83, 0.7)",
                    "rgb(246, 148, 85, 0.7)",
                    "rgb(248, 174, 93, 0.7)",
                    "rgb(247, 199, 107, 0.7)",
                    "rgb(207, 211, 117, 0.7)",
                    "rgb(169, 198, 112, 0.7)",
                    "rgb(133, 183, 110, 0.7)",
                    "rgb(97, 168, 109, 0.7)",
                    "rgb(60, 152, 109, 0.7)",
                    "rgb(72, 143, 49, 0.7)",
                ],
                borderColor: [
                    "rgb(222, 66, 91)",
                    "rgb(233, 95, 85)",
                    "rgb(241, 122, 83)",
                    "rgb(246, 148, 85)",
                    "rgb(248, 174, 93)",
                    "rgb(247, 199, 107)",
                    "rgb(207, 211, 117)",
                    "rgb(169, 198, 112)",
                    "rgb(133, 183, 110)",
                    "rgb(97, 168, 109)",
                    "rgb(60, 152, 109)",
                    "rgb(72, 143, 49)",
                ],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        scales: {
            xAxes: {
                grid: {
                    ...(theme === "dark" && {
                        color: "rgb(255, 255, 255, 0.2)",
                    }),
                },
            },
            yAxes: {
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

    return <Bar data={data} options={options} />;
}

export default AnimeRatingChart;
