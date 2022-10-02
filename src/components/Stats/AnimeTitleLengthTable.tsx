import { Anime } from "@/types/Anime";

function AnimeTitleLenghtTable({ anime = [] }: { anime?: Anime[] }) {
    anime.sort((a, b) => b.title.length - a.title.length);

    return (
        <table className="mt-4 h-[90%] w-full text-center">
            <thead className="text-xs uppercase text-gray-700 dark:text-gray-400">
                <tr>
                    <th className="bg-gray-50 py-3 px-6 dark:bg-gray-800">
                        Rank
                    </th>
                    <th className="py-3 px-6">Title</th>
                    <th className="bg-gray-50 py-3 px-6 dark:bg-gray-800">
                        Length <br /> (characters)
                    </th>
                </tr>
            </thead>
            <tbody>
                {anime.slice(0, 5).map((a, i, array) => (
                    <tr
                        key={a.id}
                        className={`${
                            i !== array.length - 1 &&
                            "border-b border-gray-400 dark:border-gray-700"
                        }`}
                    >
                        <th className="whitespace-nowrap bg-gray-50 py-4 px-6 font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                            {i + 1}
                        </th>
                        <td className="py-4 px-6">{a.title}</td>
                        <td className="whitespace-nowrap bg-gray-50 py-4 px-6 font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                            {a.title.length}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AnimeTitleLenghtTable;
