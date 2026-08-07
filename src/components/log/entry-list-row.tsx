/* biome-ignore-all lint/performance/noImgElement: Entry images may be user-provided custom URLs. */
'use client';

import dayjs from 'dayjs';
import { BookOpen, CalendarDays, Edit3, ExternalLink, Heart, PlayCircle, Trash2, Tv } from 'lucide-react';
import DeleteButton from '@/components/util/delete-button';
import type { AnimeType } from '@/types/anime';
import { cn } from '@/utils/helper';

type EntryListRowPropsType = {
    anime: AnimeType;
    readOnly: boolean;
    onEdit: (anime: AnimeType) => void;
    onDelete: (anime: AnimeType) => void;
    onFavorite: (anime: AnimeType) => void;
};

const statusLabels: Record<string, string> = {
    PLANNED: 'Planned',
    WATCHING: 'Watching',
    COMPLETED: 'Completed',
    PAUSED: 'Paused',
    DROPPED: 'Dropped',
};

export default function EntryListRow({ anime, readOnly, onEdit, onDelete, onFavorite }: EntryListRowPropsType) {
    return (
        <article className="flex flex-col gap-4 border-(--border) border-b p-4 last:border-b-0 sm:flex-row sm:items-center">
            <img
                src={anime.imageUrl || '/placeholder.jpg'}
                alt=""
                className="h-24 w-17 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="display-font truncate font-bold text-base">{anime.title}</h3>
                    <span className="muted inline-flex items-center gap-1 text-xs">
                        {anime.isManga ? <BookOpen size={13} /> : <Tv size={13} />}
                        {anime.isManga ? 'Manga' : 'Anime'}
                    </span>
                    <span className="rounded-full bg-(--accent-soft) px-2 py-1 font-bold text-(--accent-strong) text-xs">
                        {statusLabels[anime.status] ?? anime.status}
                    </span>
                </div>
                <div className="muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1">
                        <Heart
                            size={13}
                            className={cn(anime.favorite && 'fill-current text-rose-400')}
                        />
                        {anime.favorite ? 'Favorite' : 'Not favorite'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="font-bold text-(--text)">{anime.rating}/10</span> rating
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <PlayCircle size={13} />
                        {anime.seasons.length} seasons · {anime.movies.length} movies · {anime.ovas.length} OVAs
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        {anime.startDate ? dayjs(anime.startDate).format('MMM D, YYYY') : 'No start date'}
                    </span>
                </div>
            </div>
            {(!readOnly || anime.link) && (
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 rounded-xl border border-(--border) bg-(--surface-muted) p-1.5 sm:ml-auto">
                    {anime.link && (
                        <a
                            href={anime.link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary h-11 min-h-11 px-3 text-sm"
                            title="Open external link"
                            aria-label={`Open link for ${anime.title}`}
                        >
                            <ExternalLink size={18} /> <span>Open</span>
                        </a>
                    )}
                    {!readOnly && (
                        <>
                            <button
                                type="button"
                                onClick={() => onFavorite(anime)}
                                className="btn-secondary h-11 min-h-11 px-3 text-sm"
                                title={anime.favorite ? 'Remove favorite' : 'Add favorite'}
                                aria-label={anime.favorite ? 'Remove favorite' : 'Add favorite'}
                            >
                                <Heart
                                    size={18}
                                    fill={anime.favorite ? 'currentColor' : 'none'}
                                    className={cn(anime.favorite && 'text-rose-400')}
                                />{' '}
                                <span>{anime.favorite ? 'Unfavorite' : 'Favorite'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onEdit(anime)}
                                className="btn-secondary h-11 min-h-11 px-3 text-sm"
                                title="Edit entry"
                                aria-label={`Edit ${anime.title}`}
                            >
                                <Edit3 size={18} /> <span>Edit</span>
                            </button>
                            <DeleteButton
                                tooltip="Delete entry"
                                title={`Delete “${anime.title}”?`}
                                text="This entry will be permanently removed."
                                successTitle="Deleted"
                                successText="The entry was removed."
                                onDeleteClick={() => onDelete(anime)}
                                className="btn-danger h-11 min-h-11 px-3 text-sm"
                                aria-label={`Delete ${anime.title}`}
                            >
                                <Trash2 size={18} /> <span>Delete</span>
                            </DeleteButton>
                        </>
                    )}
                </div>
            )}
        </article>
    );
}
