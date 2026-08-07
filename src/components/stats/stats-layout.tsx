'use client';

import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ArrowLeft, BarChart3, BookOpen, LibraryBig, Star, Tv } from 'lucide-react';
import Link from 'next/link';
import AnimeRatingChart from '@/components/stats/anime-rating-chart';
import AnimeTitleLenghtTable from '@/components/stats/anime-title-length-table';
import AnimeWatchtypeChart from '@/components/stats/anime-watchtype-chart';
import AnimeWeekdayChart from '@/components/stats/anime-weekday-chart';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';
import type { AnimeType } from '@/types/anime';
import { type LogOptionsType, OrderValues } from '@/types/log-options';
import { cn } from '@/utils/helper';
import { trpc } from '@/utils/trpc';

const DynamicAnimeStartDateChartType = dynamic<{ anime?: AnimeType[] }>(
    () => import('@/components/stats/anime-start-date-chart'),
    { ssr: false },
);

export default function StatsLayout({ shareId }: { shareId?: string }) {
    const logOptions: LogOptionsType = {
        order: OrderValues.START_DATE,
        asc: true,
        searchTerm: '',
        filter: { anime: true, manga: true, favorites: false, statuses: [] },
    };

    const getAnime = trpc.anime.get.useQuery({ shareId, logOptions });
    const getUser = trpc.user.getByShareId.useQuery({ shareId: shareId ?? '' }, { enabled: Boolean(shareId) });
    const anime = getAnime.data ?? [];
    const average = anime.length
        ? (anime.reduce((sum, entry) => sum + entry.rating, 0) / anime.length).toFixed(1)
        : '—';

    if (getAnime.isError || getUser.isError) {
        return (
            <div className="page-frame py-8">
                <ErrorAlert message={getAnime.error?.message || getUser.error?.message} />
            </div>
        );
    }

    if (getUser.isFetched && !getUser.data) {
        return (
            <div className="page-frame py-8">
                <ErrorAlert message="No stats with this id." />
            </div>
        );
    }

    if (getAnime.isLoading) {
        return <Loading />;
    }

    return (
        <div className="page-frame py-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    {shareId && (
                        <Link
                            href={`/${shareId}`}
                            className="muted mb-3 inline-flex items-center gap-2 font-semibold text-sm hover:text-(--text)"
                        >
                            <ArrowLeft size={16} /> Back to library
                        </Link>
                    )}
                    <div className="flex items-center gap-2 font-bold text-(--accent-strong) text-sm">
                        <BarChart3 size={17} /> Collection insights
                    </div>
                    <h1 className="display-font mt-2 font-bold text-3xl tracking-tight sm:text-4xl">
                        {shareId ? `${getUser.data?.name || 'Shared'}'s statistics` : 'Your statistics'}
                    </h1>
                </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric
                    icon={<LibraryBig size={17} />}
                    label="Entries"
                    value={anime.length}
                />
                <Metric
                    icon={<Tv size={17} />}
                    label="Anime"
                    value={anime.filter((entry) => !entry.isManga).length}
                />
                <Metric
                    icon={<BookOpen size={17} />}
                    label="Manga"
                    value={anime.filter((entry) => entry.isManga).length}
                />
                <Metric
                    icon={<Star size={17} />}
                    label="Average rating"
                    value={average}
                />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <ChartPanel title="Rating distribution">
                    <AnimeRatingChart anime={anime} />
                </ChartPanel>
                <ChartPanel title="Entries by weekday">
                    <AnimeWeekdayChart anime={anime} />
                </ChartPanel>
                <ChartPanel
                    title="Collection over time"
                    wide
                >
                    <DynamicAnimeStartDateChartType anime={anime} />
                </ChartPanel>
                <ChartPanel title="Watch type">
                    <div className="mx-auto h-full max-w-sm">
                        <AnimeWatchtypeChart anime={anime} />
                    </div>
                </ChartPanel>
                <ChartPanel
                    title="Longest titles"
                    table
                >
                    <AnimeTitleLenghtTable anime={anime} />
                </ChartPanel>
            </div>
        </div>
    );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="surface rounded-2xl p-4">
            <div className="muted flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                {icon}
                {label}
            </div>
            <p className="display-font mt-2 font-bold text-2xl">{value}</p>
        </div>
    );
}

function ChartPanel({
    title,
    children,
    wide = false,
    table = false,
}: {
    title: string;
    children: React.ReactNode;
    wide?: boolean;
    table?: boolean;
}) {
    return (
        <section className={cn('surface min-h-80 rounded-2xl p-4 sm:p-5', wide && 'lg:col-span-2')}>
            <div className="mb-4 border-(--border) border-b pb-3">
                <h2 className="display-font font-bold text-lg">{title}</h2>
            </div>
            <div className={cn(table ? 'min-h-0' : 'relative h-[min(62vw,360px)] min-h-60 w-full')}>{children}</div>
        </section>
    );
}
