import type { Anime } from '@/types/anime';

type AnimeTitleLenghtTablePropsType = {
    anime?: Anime[];
};

const AnimeTitleLenghtTable = ({ anime = [] }: AnimeTitleLenghtTablePropsType) => {
    const longestTitles = [...anime].sort((a, b) => b.title.length - a.title.length);

    return (
        <table className="w-full table-fixed text-center text-sm">
            <thead className="muted text-xs uppercase">
                <tr>
                    <th className="w-20 bg-(--surface-muted) px-3 py-2">Rank</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="w-28 bg-(--surface-muted) px-3 py-2">
                        Length <br /> (characters)
                    </th>
                </tr>
            </thead>
            <tbody>
                {longestTitles.slice(0, 5).map((a, i, array) => (
                    <tr
                        key={a.id}
                        className={`${i !== array.length - 1 ? 'border-b border-(--border)' : ''}`}
                    >
                        <th className="bg-(--surface-muted) px-3 py-3 font-medium whitespace-nowrap">
                            {i + 1}
                        </th>
                        <td className="max-w-0 px-3 py-3"><span className="line-clamp-2">{a.title}</span></td>
                        <td className="bg-(--surface-muted) px-3 py-3 font-medium whitespace-nowrap">
                            {a.title.length}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AnimeTitleLenghtTable;
