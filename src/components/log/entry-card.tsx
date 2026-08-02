/* biome-ignore-all lint/performance/noImgElement: Entry images may be user-provided custom URLs. */
'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BookOpen, CalendarDays, Edit3, ExternalLink, FileText, Heart, PlayCircle, Tv, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { Anime } from '@/types/anime';
import DeleteButton from '@/components/util/delete-button';

dayjs.extend(relativeTime);

type EntryCardProps = {
    anime: Anime;
    readOnly: boolean;
    onEdit: (anime: Anime) => void;
    onDelete: (anime: Anime) => void;
    onFavorite: (anime: Anime) => void;
};

const statusLabels: Record<string, string> = {
    PLANNED: 'Planned',
    WATCHING: 'Watching',
    COMPLETED: 'Completed',
    PAUSED: 'Paused',
    DROPPED: 'Dropped',
};

const trackingSummary = (anime: Anime) => {
    const parts = [
        anime.seasons.length ? `${anime.seasons.length} season${anime.seasons.length === 1 ? '' : 's'}` : '',
        anime.movies.length ? `${anime.movies.length} movie${anime.movies.length === 1 ? '' : 's'}` : '',
        anime.ovas.length ? `${anime.ovas.length} OVA${anime.ovas.length === 1 ? '' : 's'}` : '',
    ].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'No tracking details yet';
};

export default function EntryCard({ anime, readOnly, onEdit, onDelete, onFavorite }: EntryCardProps) {
    const [noteOpen, setNoteOpen] = useState(false);

    return (
        <article className="group overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
            <div className="relative aspect-[4/5.65] overflow-hidden bg-(--surface-muted)">
                <img src={anime.imageUrl || '/placeholder.jpg'} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/10" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-slate-950/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {anime.isManga ? <BookOpen size={13} className="mr-1 inline" /> : <Tv size={13} className="mr-1 inline" />}
                        {anime.isManga ? 'Manga' : 'Anime'}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900">{anime.rating}/10</span>
                </div>
                {(!readOnly || anime.link) && <div className="absolute top-3 right-3 flex flex-col items-center gap-1.5">
                    {anime.link && <a href={anime.link} target="_blank" rel="noreferrer" aria-label={`Open link for ${anime.title}`} title="Open external link" className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85"><ExternalLink size={14} /></a>}
                    {!readOnly && <>
                        <button type="button" onClick={() => onFavorite(anime)} aria-label={anime.favorite ? 'Remove favorite' : 'Add favorite'} title={anime.favorite ? 'Remove favorite' : 'Add favorite'} className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85">
                            <Heart size={15} fill={anime.favorite ? 'currentColor' : 'none'} className={anime.favorite ? 'text-rose-300' : ''} />
                        </button>
                        <button type="button" onClick={() => onEdit(anime)} aria-label={`Edit ${anime.title}`} title="Edit entry" className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/85">
                            <Edit3 size={14} />
                        </button>
                        <DeleteButton tooltip="Delete entry" title={`Delete “${anime.title}”?`} text="This entry will be permanently removed." successTitle="Deleted" successText="The entry was removed." onDeleteClick={() => onDelete(anime)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-rose-500/90" aria-label={`Delete ${anime.title}`}>
                            <Trash2 size={14} />
                        </DeleteButton>
                    </>}
                </div>}
                <div className="absolute right-3 bottom-3 left-3 text-white">
                    <h3 className="display-font line-clamp-2 text-lg leading-tight font-bold drop-shadow-md">{anime.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                        <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{anime.startDate ? dayjs(anime.startDate).format('MMM D, YYYY') : 'No start date'}</span>
                    </div>
                </div>
            </div>
            <div className={`space-y-3 p-4 ${noteOpen ? 'min-h-24' : 'h-24'}`}>
                <div className="flex min-h-6 items-center justify-between gap-2">
                    <span className="rounded-full bg-(--accent-soft) px-2.5 py-1 text-xs font-bold text-(--accent-strong)">{statusLabels[anime.status] ?? anime.status}</span>
                    <span className="muted min-w-0 truncate text-xs">Updated {dayjs(anime.updatedAt).fromNow()}</span>
                </div>
                <div className="flex h-5 items-center justify-between gap-2">
                    <p className="muted flex min-w-0 items-center gap-1.5 truncate text-xs"><PlayCircle size={14} />{trackingSummary(anime)}</p>
                    {anime.note && <button type="button" title="View note" aria-label={`View note for ${anime.title}`} aria-expanded={noteOpen} onClick={() => setNoteOpen((open) => !open)} className={`btn-ghost min-h-8 w-8 shrink-0 p-0 ${noteOpen ? 'text-(--accent-strong)' : ''}`}><FileText size={15} /></button>}
                </div>
                {noteOpen && anime.note && <div className="rounded-xl border border-(--accent)/30 bg-(--accent-soft) p-3 text-sm"><div className="mb-1 flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-wider text-(--accent-strong)">Note</span><button type="button" title="Close note" aria-label="Close note" onClick={() => setNoteOpen(false)} className="muted hover:text-(--text)"><X size={15} /></button></div><p className="whitespace-pre-wrap text-(--text)">{anime.note}</p></div>}
            </div>
        </article>
    );
}
