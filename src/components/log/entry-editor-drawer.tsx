/* biome-ignore-all lint/performance/noImgElement: These are small, user-selected preview images. */
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Check, ImagePlus, LoaderCircle, Plus, Star, X } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { Anime, AnimeDraft } from '@/types/anime';
import { AnimeStatusValues } from '@/types/anime';
import { searchTitles, type AnimeSearchResult } from '@/utils/anime-info';

type EntryEditorDrawerProps = {
    open: boolean;
    initialAnime?: Anime;
    onClose: () => void;
    onSave: (anime: AnimeDraft) => Promise<{ success: boolean; error?: string }>;
};

export const createBlankAnime = (): AnimeDraft => ({
    title: '', isManga: false, seasons: [], movies: [], ovas: [], rating: 5, favorite: false,
    status: AnimeStatusValues.PLANNED, link: null, note: null, imageUrl: null, hasCustomImage: false, startDate: null,
});

const statusLabels: Record<string, string> = { PLANNED: 'Planned', WATCHING: 'Watching', COMPLETED: 'Completed', PAUSED: 'Paused', DROPPED: 'Dropped' };

function NumberChips({ label, values, onChange }: { label: string; values: number[]; onChange: (values: number[]) => void }) {
    const [value, setValue] = useState((values.at(-1) ?? 0) + 1);
    const add = () => { if (value > 0 && !values.includes(value)) onChange([...values, value].sort((a, b) => a - b)); setValue((current) => current + 1); };
    const inputId = `${label.toLowerCase()}-number`;
    return <div className="space-y-2"><div className="flex items-center justify-between"><label htmlFor={inputId} className="text-sm font-bold">{label}</label><span className="muted text-xs">{values.length} tracked</span></div><div className="flex gap-2"><input id={inputId} className="field min-w-0" type="number" min="1" value={value} onChange={(event) => setValue(Number(event.target.value))} aria-label={`${label} number`} /><button type="button" className="btn-secondary min-h-11 w-11 p-0" onClick={add} aria-label={`Add ${label}`}><Plus size={17} /></button></div><div className="flex min-h-7 flex-wrap gap-1.5">{values.map((item) => <button type="button" key={item} onClick={() => onChange(values.filter((entry) => entry !== item))} className="rounded-full bg-(--surface-strong) px-2.5 py-1 text-xs font-bold" aria-label={`Remove ${label} ${item}`}>{item} <X size={12} className="ml-1 inline" /></button>)}</div></div>;
}

export default function EntryEditorDrawer({ open, initialAnime, onClose, onSave }: EntryEditorDrawerProps) {
    const [anime, setAnime] = useState<AnimeDraft>(createBlankAnime());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AnimeSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (open) setAnime(initialAnime ? { ...initialAnime } : createBlankAnime());
        setError(undefined);
        setQuery('');
        setSuggestions([]);
    }, [open, initialAnime]);

    useEffect(() => {
        if (!open || !query.trim()) { setSuggestions([]); return; }
        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            setSearching(true);
            void searchTitles(query, anime.isManga).then(setSuggestions).catch(() => setSuggestions([])).finally(() => setSearching(false));
        }, 350);
        return () => { controller.abort(); window.clearTimeout(timer); };
    }, [query, anime.isManga, open]);

    const update = <K extends keyof AnimeDraft>(key: K, value: AnimeDraft[K]) => setAnime((current) => ({ ...current, [key]: value }));
    const statusOptions = useMemo(() => Object.values(AnimeStatusValues), []);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!anime.title.trim()) { setError('Give this entry a title before saving.'); return; }
        setLoading(true);
        const result = await onSave({ ...anime, title: anime.title.trim(), link: anime.link || null, note: anime.note || null, imageUrl: anime.imageUrl || null });
        setLoading(false);
        if (result.success) onClose(); else setError(result.error || 'Could not save this entry.');
    };

    return <Transition show={open} as={Fragment}>
        <Dialog onClose={onClose} className="relative z-50">
            <Transition.Child as={Fragment} enter="transition-opacity duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm" /></Transition.Child>
            <div className="fixed inset-0 overflow-hidden"><div className="absolute inset-0 overflow-hidden"><div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10"><Transition.Child as={Fragment} enter="transform transition duration-300 ease-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-200 ease-in" leaveFrom="translate-x-0" leaveTo="translate-x-full"><Dialog.Panel className="pointer-events-auto flex h-full w-screen max-w-2xl flex-col bg-(--surface) shadow-2xl">
                <div className="flex items-start justify-between border-b border-(--border) px-5 py-5 sm:px-8"><div><Dialog.Title className="display-font text-xl font-bold">{anime.id ? 'Edit entry' : 'Add to your log'}</Dialog.Title><p className="muted mt-1 text-sm">Keep the details you care about close at hand.</p></div><button type="button" onClick={onClose} className="btn-ghost min-h-10 w-10 p-0" aria-label="Close editor"><X /></button></div>
                <form className="flex min-h-0 flex-1 flex-col" onSubmit={(event) => void submit(event)}>
                    <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-8">
                        {error && <div className="rounded-xl border border-(--danger)/30 bg-(--danger)/10 p-3 text-sm font-semibold text-(--danger)" role="alert">{error}</div>}
                        <section className="space-y-4"><div><p className="muted text-xs font-bold uppercase tracking-widest">Identity</p><h2 className="display-font mt-1 text-lg font-bold">What are you logging?</h2></div><div className="flex rounded-xl border border-(--border) p-1"><button type="button" onClick={() => update('isManga', false)} className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${!anime.isManga ? 'bg-(--accent) text-white' : 'muted'}`}>Anime</button><button type="button" onClick={() => update('isManga', true)} className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${anime.isManga ? 'bg-(--accent) text-white' : 'muted'}`}>Manga</button></div><div className="relative"><label htmlFor="entry-title" className="mb-2 block text-sm font-bold">Title</label><input id="entry-title" className="field" value={anime.title} onChange={(event) => { update('title', event.target.value); setQuery(event.target.value); }} placeholder="e.g. Frieren: Beyond Journey's End" maxLength={250} required autoFocus />{query && !anime.hasCustomImage && <div className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-xl">{searching && <p className="muted flex items-center gap-2 p-3 text-sm"><LoaderCircle size={15} className="animate-spin" /> Searching Kitsu...</p>}{!searching && suggestions.map((suggestion) => <button type="button" key={suggestion.id} className="flex w-full items-center gap-3 p-3 text-left hover:bg-(--surface-muted)" onClick={() => { update('title', suggestion.title); update('imageUrl', suggestion.imageUrl); setQuery(''); setSuggestions([]); }}><img src={suggestion.imageUrl || '/placeholder.jpg'} alt="" className="h-12 w-9 rounded object-cover" /><span className="text-sm font-semibold">{suggestion.title}</span><Check size={16} className="muted ml-auto" /></button>)}{!searching && !suggestions.length && <p className="muted p-3 text-xs">No matches. You can keep entering a custom title.</p>}</div>}</div></section>
                        <section className="space-y-4"><div><p className="muted text-xs font-bold uppercase tracking-widest">Cover</p><h2 className="display-font mt-1 text-lg font-bold">Make it recognizable</h2></div><div className="flex gap-4"><img src={anime.imageUrl || '/placeholder.jpg'} alt="Selected cover preview" className="h-36 w-24 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1 space-y-3"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={anime.hasCustomImage} onChange={(event) => update('hasCustomImage', event.target.checked)} /> Use a custom image URL</label><div className="relative"><input className="field" type="url" disabled={!anime.hasCustomImage} value={anime.imageUrl || ''} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://..." /></div><p className="muted flex items-center gap-1 text-xs"><ImagePlus size={14} /> Automatic suggestions come from Kitsu.</p></div></div></section>
                        <section className="space-y-4"><div><p className="muted text-xs font-bold uppercase tracking-widest">Library status</p><h2 className="display-font mt-1 text-lg font-bold">Where is it in your journey?</h2></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{statusOptions.map((status) => <button type="button" key={status} onClick={() => update('status', status)} className={`rounded-xl border px-2 py-3 text-xs font-bold ${anime.status === status ? 'border-(--accent) bg-(--accent-soft) text-(--accent-strong)' : 'border-(--border) muted'}`}>{statusLabels[status]}</button>)}</div><div className="flex items-center gap-3 rounded-xl bg-(--surface-muted) p-3"><Star size={18} className={anime.favorite ? 'fill-current text-amber-500' : 'muted'} /><div className="flex-1"><p className="text-sm font-bold">Favorite</p><p className="muted text-xs">Keep this entry easy to find.</p></div><button type="button" onClick={() => update('favorite', !anime.favorite)} className={`relative h-7 w-12 rounded-full transition ${anime.favorite ? 'bg-(--accent)' : 'bg-(--surface-strong)'}`} aria-label="Toggle favorite"><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${anime.favorite ? 'left-6' : 'left-1'}`} /></button></div><div><label htmlFor="rating" className="mb-2 flex justify-between text-sm font-bold"><span>Rating</span><span className="text-(--accent-strong)">{anime.rating}/10</span></label><input id="rating" className="w-full accent-(--accent)" type="range" min="0" max="10" step="1" value={anime.rating} onChange={(event) => update('rating', Number(event.target.value))} /></div></section>
                        <section className="space-y-4"><div><p className="muted text-xs font-bold uppercase tracking-widest">Tracking</p><h2 className="display-font mt-1 text-lg font-bold">Add what you watched</h2></div><div className="grid gap-5 sm:grid-cols-3"><NumberChips label="Seasons" values={anime.seasons} onChange={(values) => update('seasons', values)} /><NumberChips label="Movies" values={anime.movies} onChange={(values) => update('movies', values)} /><NumberChips label="OVAs" values={anime.ovas} onChange={(values) => update('ovas', values)} /></div></section>
                        <section className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="start-date" className="mb-2 block text-sm font-bold">Start date</label><input id="start-date" className="field" type="date" value={anime.startDate ? new Date(anime.startDate).toISOString().slice(0, 10) : ''} onChange={(event) => update('startDate', event.target.value ? new Date(`${event.target.value}T00:00:00`) : null)} /></div><div><label htmlFor="entry-link" className="mb-2 block text-sm font-bold">External link</label><input id="entry-link" className="field" type="url" value={anime.link || ''} onChange={(event) => update('link', event.target.value)} placeholder="https://..." /></div><div className="sm:col-span-2"><label htmlFor="entry-note" className="mb-2 block text-sm font-bold">Note</label><textarea id="entry-note" className="field min-h-28 resize-y" value={anime.note || ''} onChange={(event) => update('note', event.target.value)} placeholder="A thought, recommendation, or reminder..." maxLength={1000} /></div></section>
                    </div>
                    <div className="flex gap-3 border-t border-(--border) bg-(--surface) px-5 py-4 sm:px-8"><button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? <><LoaderCircle size={17} className="animate-spin" /> Saving...</> : <><Check size={17} /> Save entry</>}</button></div>
                </form>
            </Dialog.Panel></Transition.Child></div></div></div>
        </Dialog>
    </Transition>;
}
