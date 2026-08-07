/* biome-ignore-all lint/performance/noImgElement: Entry images may be user-provided custom URLs. */
'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    BookOpen,
    CalendarDays,
    Edit3,
    ExternalLink,
    FileText,
    Heart,
    PlayCircle,
    Sparkles,
    Star,
    Trash2,
    Tv,
    X,
} from 'lucide-react';
import { useState } from 'react';
import DeleteButton from '@/components/util/delete-button';
import type { AnimeType } from '@/types/anime';
import { animeStatusClasses, animeStatusLabels } from '@/utils/anime-status';
import { cn } from '@/utils/helper';

dayjs.extend(relativeTime);

type EntryCardPropsType = {
    anime: AnimeType;
    readOnly: boolean;
    onEdit: (anime: AnimeType) => void;
    onDelete: (anime: AnimeType) => void;
    onFavorite: (anime: AnimeType) => void;
};

const trackingSummary = (anime: AnimeType) => {
    const parts = [
        anime.seasons.length ? `${anime.seasons.length} season${anime.seasons.length === 1 ? '' : 's'}` : '',
        anime.movies.length ? `${anime.movies.length} movie${anime.movies.length === 1 ? '' : 's'}` : '',
        anime.ovas.length ? `${anime.ovas.length} OVA${anime.ovas.length === 1 ? '' : 's'}` : '',
    ].filter(Boolean);

    return parts.length ? parts.join(' · ') : 'No tracking details yet';
};

const starPositions = ['first', 'second', 'third', 'fourth', 'fifth'] as const;

export default function EntryCard({ anime, readOnly, onEdit, onDelete, onFavorite }: EntryCardPropsType) {
    const [noteOpen, setNoteOpen] = useState(false);
    const isBeyondPerfect = anime.rating === 11;
    const starRating = Math.min(anime.rating, 10) / 2;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-sm transition hover:shadow-slate-950/10 hover:shadow-xl">
            <div className="relative aspect-[4/5.65] overflow-hidden bg-(--surface-muted)">
                <img
                    src={anime.imageUrl || '/placeholder.jpg'}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-slate-950/10" />
                <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                    <div className="flex items-center gap-2 rounded-full bg-slate-950/65 px-2.5 py-1 font-bold text-white text-xs backdrop-blur-md">
                        {anime.isManga ? (
                            <BookOpen
                                size={13}
                                className="inline"
                            />
                        ) : (
                            <Tv
                                size={13}
                                className="-mt-0.5 inline"
                            />
                        )}
                        <span>{anime.isManga ? 'Manga' : 'Anime'}</span>
                    </div>
                    {anime.note && (
                        <button
                            type="button"
                            title={noteOpen ? 'Hide note' : 'Show note'}
                            aria-label={`${noteOpen ? 'Hide' : 'Show'} note for ${anime.title}`}
                            aria-expanded={noteOpen}
                            onClick={() => setNoteOpen((open) => !open)}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85"
                        >
                            <FileText size={14} />
                        </button>
                    )}
                </div>
                {(!readOnly || anime.link) && (
                    <div className="absolute top-3 right-3 flex flex-col items-center gap-1.5">
                        {anime.link && (
                            <a
                                href={anime.link}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open link for ${anime.title}`}
                                title="Open external link"
                                className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85"
                            >
                                <ExternalLink size={14} />
                            </a>
                        )}
                        {!readOnly && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onFavorite(anime)}
                                    aria-label={anime.favorite ? 'Remove favorite' : 'Add favorite'}
                                    title={anime.favorite ? 'Remove favorite' : 'Add favorite'}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85"
                                >
                                    <Heart
                                        size={15}
                                        fill={anime.favorite ? 'currentColor' : 'none'}
                                        className={cn(anime.favorite && 'text-rose-300')}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onEdit(anime)}
                                    aria-label={`Edit ${anime.title}`}
                                    title="Edit entry"
                                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <DeleteButton
                                    tooltip="Delete entry"
                                    title={`Delete “${anime.title}”?`}
                                    text="This entry will be permanently removed."
                                    successTitle="Deleted"
                                    successText="The entry was removed."
                                    onDeleteClick={() => onDelete(anime)}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-rose-500/90"
                                    aria-label={`Delete ${anime.title}`}
                                >
                                    <Trash2 size={14} />
                                </DeleteButton>
                            </>
                        )}
                    </div>
                )}
                <div className="absolute right-3 bottom-3 left-3 text-white">
                    <h3 className="display-font line-clamp-2 font-bold text-lg leading-tight drop-shadow-md">
                        {anime.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-white/80 text-xs">
                        <span
                            className={cn(
                                'inline-flex shrink-0 items-center gap-0.5',
                                isBeyondPerfect && 'text-amber-200',
                            )}
                            role="img"
                        >
                            {starPositions.map((position, index) => {
                                const isFull = index < fullStars;
                                const isHalf = !isFull && index === fullStars && hasHalfStar;

                                return (
                                    <span
                                        key={position}
                                        className="relative inline-flex"
                                        aria-hidden="true"
                                    >
                                        <Star
                                            size={16}
                                            strokeWidth={2.5}
                                            fill={isFull ? 'currentColor' : 'none'}
                                            className={
                                                isFull
                                                    ? 'text-amber-300'
                                                    : 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                                            }
                                        />
                                        {isHalf && (
                                            <span className="absolute inset-y-0 left-0 w-[50%] overflow-hidden">
                                                <Star
                                                    size={16}
                                                    strokeWidth={2.5}
                                                    fill="currentColor"
                                                    className="max-w-none text-amber-300"
                                                />
                                            </span>
                                        )}
                                    </span>
                                );
                            })}
                            {isBeyondPerfect && (
                                <Sparkles
                                    size={13}
                                    className="ml-0.5 text-amber-200"
                                    aria-hidden="true"
                                />
                            )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {anime.startDate ? dayjs(anime.startDate).format('MMM D, YYYY') : 'No start date'}
                        </span>
                    </div>
                </div>
                {noteOpen && anime.note && (
                    <div className="menu-panel absolute right-3 bottom-24 left-3 max-h-[calc(100%-3rem)] overflow-y-auto p-3 text-sm">
                        <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-xs uppercase tracking-wider">Note</span>
                            <button
                                type="button"
                                title="Close note"
                                aria-label="Close note"
                                onClick={() => setNoteOpen(false)}
                                className="muted hover:text-(--text)"
                            >
                                <X size={15} />
                            </button>
                        </div>
                        <p className="whitespace-pre-wrap text-white">{anime.note}</p>
                    </div>
                )}
            </div>
            <div className="h-20 space-y-2 p-3">
                <div className="flex min-h-6 items-center justify-between gap-2">
                    <span
                        className={cn(
                            'rounded-full border px-2.5 py-1 font-bold text-xs',
                            animeStatusClasses[anime.status] ?? 'border-(--border) bg-(--surface-muted) text-(--text)',
                        )}
                    >
                        {animeStatusLabels[anime.status] ?? anime.status}
                    </span>
                    <span className="muted min-w-0 truncate text-xs">Updated {dayjs(anime.updatedAt).fromNow()}</span>
                </div>
                <div className="flex h-5 items-center justify-between gap-2">
                    <p className="muted flex min-w-0 items-center gap-1.5 truncate text-xs">
                        <PlayCircle size={14} />
                        {trackingSummary(anime)}
                    </p>
                </div>
            </div>
        </article>
    );
}
