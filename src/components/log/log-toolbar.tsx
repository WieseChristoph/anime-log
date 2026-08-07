'use client';

import { LayoutGrid, List, Plus, SlidersHorizontal, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type AnimeStatusType, AnimeStatusValues } from '@/types/anime';
import { type LogOptionsType, OrderValues } from '@/types/log-options';
import { animeStatusClasses, animeStatusLabels } from '@/utils/anime-status';
import { cn } from '@/utils/helper';

type ViewModeType = 'grid' | 'list';

type ToolbarPropsType = {
    options: LogOptionsType;
    onChange: (options: LogOptionsType) => void;
    viewMode: ViewModeType;
    onViewModeChange: (mode: ViewModeType) => void;
    onAddEntry?: () => void;
};

const statuses = Object.values(AnimeStatusValues);
const sortOptions = [
    { value: 'title-asc', order: OrderValues.TITLE, asc: true },
    { value: 'title-desc', order: OrderValues.TITLE, asc: false },
    { value: 'rating-desc', order: OrderValues.RATING, asc: false },
    { value: 'rating-asc', order: OrderValues.RATING, asc: true },
    { value: 'startDate-desc', order: OrderValues.START_DATE, asc: false },
    { value: 'updatedAt-desc', order: OrderValues.UPDATED_AT, asc: false },
] as const;

export default function LogToolbar({ options, onChange, viewMode, onViewModeChange, onAddEntry }: ToolbarPropsType) {
    const [search, setSearch] = useState(options.searchTerm);

    useEffect(() => setSearch(options.searchTerm), [options.searchTerm]);

    const toggleStatus = (status: AnimeStatusType) => {
        const statuses = options.filter.statuses.includes(status)
            ? options.filter.statuses.filter((item) => item !== status)
            : [...options.filter.statuses, status];
        onChange({ ...options, filter: { ...options.filter, statuses } });
    };

    const clearFilters = () => {
        setSearch('');
        onChange({
            order: OrderValues.TITLE,
            asc: true,
            searchTerm: '',
            filter: { anime: true, manga: true, favorites: false, statuses: [] },
        });
    };

    const hasFilters = Boolean(
        options.searchTerm ||
            options.filter.favorites ||
            options.filter.statuses.length ||
            !options.filter.anime ||
            !options.filter.manga,
    );

    return (
        <section className="surface rounded-2xl p-2 sm:p-2.5">
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(16rem,1fr)_auto] lg:items-center lg:gap-x-5 lg:gap-y-2">
                <label className="relative min-w-0">
                    <input
                        className="field field-compact px-3"
                        type="text"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            onChange({ ...options, searchTerm: event.target.value });
                        }}
                        placeholder="Search your library"
                        aria-label="Search your library"
                    />
                </label>
                <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
                    <span className="muted hidden items-center gap-1 font-bold text-xs uppercase tracking-widest sm:flex">
                        <SlidersHorizontal size={14} /> Filters
                    </span>
                    {(['anime', 'manga'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            aria-pressed={options.filter[type]}
                            onClick={() =>
                                onChange({
                                    ...options,
                                    filter: {
                                        ...options.filter,
                                        [type]:
                                            !options.filter[type] ||
                                            !options.filter[type === 'anime' ? 'manga' : 'anime'],
                                    },
                                })
                            }
                            className={cn(
                                'min-h-9 rounded-xl border px-3 font-semibold text-sm transition',
                                options.filter[type]
                                    ? 'border-(--accent) bg-(--accent-soft) text-(--text)'
                                    : 'muted border-(--border) opacity-70',
                            )}
                        >
                            {type[0]?.toUpperCase()}
                            {type.slice(1)}
                        </button>
                    ))}
                    <button
                        type="button"
                        aria-pressed={options.filter.favorites}
                        onClick={() =>
                            onChange({
                                ...options,
                                filter: { ...options.filter, favorites: !options.filter.favorites },
                            })
                        }
                        className={cn(
                            'flex min-h-9 items-center gap-2 rounded-xl border px-3 font-semibold text-sm transition',
                            options.filter.favorites
                                ? 'border-(--accent) bg-(--accent-soft) text-(--text)'
                                : 'muted border-(--border)',
                        )}
                    >
                        <Star
                            size={15}
                            className={cn(options.filter.favorites && 'fill-current text-amber-500')}
                        />{' '}
                        Favorites
                    </button>
                    <select
                        className="field field-compact min-h-9 w-auto py-2 font-semibold text-sm"
                        value={
                            sortOptions.find((option) => option.order === options.order && option.asc === options.asc)
                                ?.value
                        }
                        onChange={(event) => {
                            const option =
                                sortOptions.find((item) => item.value === event.target.value) ?? sortOptions[0];
                            onChange({ ...options, order: option.order, asc: option.asc });
                        }}
                        aria-label="Sort entries"
                    >
                        <option value="title-asc">Title A–Z</option>
                        <option value="title-desc">Title Z–A</option>
                        <option value="rating-desc">Highest rated</option>
                        <option value="rating-asc">Lowest rated</option>
                        <option value="startDate-desc">Recently started</option>
                        <option value="updatedAt-desc">Recently updated</option>
                    </select>
                    <fieldset className="flex rounded-xl border border-(--border) p-0.5">
                        <legend className="sr-only">View mode</legend>
                        <button
                            type="button"
                            onClick={() => onViewModeChange('grid')}
                            className={cn(
                                'grid h-8 w-8 place-items-center rounded-lg',
                                viewMode === 'grid' ? 'bg-(--accent) text-white' : 'muted',
                            )}
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewModeChange('list')}
                            className={cn(
                                'grid h-8 w-8 place-items-center rounded-lg',
                                viewMode === 'list' ? 'bg-(--accent) text-white' : 'muted',
                            )}
                            aria-label="List view"
                        >
                            <List size={15} />
                        </button>
                    </fieldset>
                    <button
                        type="button"
                        disabled={!hasFilters}
                        className={cn('btn-ghost min-h-9 px-2 text-sm', !hasFilters && 'cursor-not-allowed opacity-40')}
                        onClick={clearFilters}
                    >
                        <X size={15} /> Clear
                    </button>
                    {onAddEntry && (
                        <button
                            type="button"
                            className="btn-primary ml-auto h-9 min-h-9 shrink-0 whitespace-nowrap px-3 py-1.5 text-sm"
                            onClick={onAddEntry}
                        >
                            <Plus size={15} /> Add entry
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 border-(--border) border-t pt-2">
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => toggleStatus(status)}
                        className={cn(
                            'rounded-full border px-3 py-1.5 font-semibold text-xs transition',
                            options.filter.statuses.includes(status)
                                ? animeStatusClasses[status]
                                : 'muted border-transparent bg-(--surface-muted) hover:text-(--text)',
                        )}
                    >
                        {animeStatusLabels[status] ?? status}
                    </button>
                ))}
            </div>
        </section>
    );
}
