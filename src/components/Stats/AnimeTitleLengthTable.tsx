import { type Anime } from '@/types/Anime';

interface Props {
    anime?: Anime[];
}

const AnimeTitleLenghtTable: React.FC<Props> = ({ anime = [] }) => {
    anime.sort((a, b) => b.title.length - a.title.length);

    return (
        <table className="mt-4 h-[90%] w-full text-center">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr>
                    <th className="bg-gray-50 px-6 py-3 dark:bg-gray-900">Rank</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="bg-gray-50 px-6 py-3 dark:bg-gray-900">
                        Length <br /> (characters)
                    </th>
                </tr>
            </thead>
            <tbody>
                {anime.slice(0, 5).map((a, i, array) => (
                    <tr
                        key={a.id}
                        className={`${i !== array.length - 1 ? 'border-b border-gray-400 dark:border-gray-700' : ''}`}
                    >
                        <th className="bg-gray-50 px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:bg-gray-900 dark:text-white">
                            {i + 1}
                        </th>
                        <td className="px-6 py-4">{a.title}</td>
                        <td className="bg-gray-50 px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:bg-gray-900 dark:text-white">
                            {a.title.length}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AnimeTitleLenghtTable;
