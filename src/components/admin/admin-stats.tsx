import { BookOpenText, LibraryBig, Tv, Users } from 'lucide-react';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';
import { trpc } from '@/utils/trpc';

export default function AdminStats() {
    const getUserCount = trpc.user.getCount.useQuery();
    const getAnimeMangaCount = trpc.anime.getCountByType.useQuery();

    if (getUserCount.isError || getAnimeMangaCount.isError) {
        return <ErrorAlert message={getUserCount.error?.message || getAnimeMangaCount.error?.message} />;
    }

    if (getUserCount.isLoading || getAnimeMangaCount.isLoading) {
        return <Loading />;
    }

    const animeCount = getAnimeMangaCount.data?.find((entry) => !entry.isManga)?._count._all ?? 0;
    const mangaCount = getAnimeMangaCount.data?.find((entry) => entry.isManga)?._count._all ?? 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetric
                icon={<Users />}
                label="Users"
                value={getUserCount.data ?? 0}
            />
            <AdminMetric
                icon={<LibraryBig />}
                label="Total entries"
                value={animeCount + mangaCount}
            />
            <AdminMetric
                icon={<Tv />}
                label="Anime"
                value={animeCount}
            />
            <AdminMetric
                icon={<BookOpenText />}
                label="Manga"
                value={mangaCount}
            />
        </div>
    );
}

function AdminMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="surface rounded-2xl p-5">
            <div className="muted flex items-center gap-3 font-bold text-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-(--accent-soft) text-(--accent-strong)">
                    {icon}
                </span>
                {label}
            </div>
            <p className="display-font mt-6 font-bold text-4xl">{value}</p>
        </div>
    );
}
