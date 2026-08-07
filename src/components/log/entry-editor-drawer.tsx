/* biome-ignore-all lint/performance/noImgElement: These are small, user-selected preview images. */
'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Check, ImagePlus, LoaderCircle, Plus, Sparkles, Star, X } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { AnimeDraftType, AnimeType } from '@/types/anime';
import { AnimeStatusValues } from '@/types/anime';
import { type AnimeSearchResultType, searchTitles } from '@/utils/anime-info';
import { animeStatusClasses, animeStatusLabels } from '@/utils/anime-status';
import { cn } from '@/utils/helper';

type EntryEditorDrawerPropsType = {
    open: boolean;
    initialAnime?: AnimeType;
    onClose: () => void;
    onSave: (anime: AnimeDraftType) => Promise<{ success: boolean; error?: string }>;
};

export const createBlankAnime = (): AnimeDraftType => ({
    title: '',
    isManga: false,
    seasons: [],
    movies: [],
    ovas: [],
    rating: 5,
    favorite: false,
    status: AnimeStatusValues.PLANNED,
    link: null,
    note: null,
    imageUrl: null,
    hasCustomImage: false,
    startDate: null,
});

function NumberChips({
    label,
    values,
    onChange,
}: {
    label: string;
    values: number[];
    onChange: (values: number[]) => void;
}) {
    const [value, setValue] = useState((values.at(-1) ?? 0) + 1);

    const add = () => {
        if (value > 0 && !values.includes(value)) {
            onChange([...values, value].sort((a, b) => a - b));
        }

        setValue((current) => current + 1);
    };

    const inputId = `${label.toLowerCase()}-number`;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label
                    htmlFor={inputId}
                    className="font-bold text-sm"
                >
                    {label}
                </label>
                <span className="muted text-xs">{values.length} tracked</span>
            </div>
            <div className="flex gap-2">
                <input
                    id={inputId}
                    className="field min-w-0"
                    type="number"
                    min="1"
                    value={value}
                    onChange={(event) => setValue(Number(event.target.value))}
                    aria-label={`${label} number`}
                />
                <button
                    type="button"
                    className="btn-secondary min-h-11 w-11 p-0"
                    onClick={add}
                    aria-label={`Add ${label}`}
                >
                    <Plus size={17} />
                </button>
            </div>
            <div className="flex min-h-7 flex-wrap gap-1.5">
                {values.map((item) => (
                    <button
                        type="button"
                        key={item}
                        onClick={() => onChange(values.filter((entry) => entry !== item))}
                        className="rounded-full bg-(--surface-strong) px-2.5 py-1 font-bold text-xs"
                        aria-label={`Remove ${label} ${item}`}
                    >
                        {item}{' '}
                        <X
                            size={12}
                            className="ml-1 inline"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function EntryEditorDrawer({ open, initialAnime, onClose, onSave }: EntryEditorDrawerPropsType) {
    const [anime, setAnime] = useState<AnimeDraftType>(createBlankAnime());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AnimeSearchResultType[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (open) {
            setAnime(initialAnime ? { ...initialAnime } : createBlankAnime());
        }

        setError(undefined);
        setQuery('');
        setSuggestions([]);
    }, [open, initialAnime]);

    useEffect(() => {
        if (!open || !query.trim()) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            setSearching(true);
            void searchTitles(query, anime.isManga, controller.signal)
                .then((results) => {
                    if (controller.signal.aborted) {
                        return;
                    }

                    setSuggestions(results);
                    const bestMatch = results.find((result) => result.imageUrl);

                    if (bestMatch?.imageUrl) {
                        setAnime((current) =>
                            current.hasCustomImage || current.title.trim() !== query.trim()
                                ? current
                                : { ...current, imageUrl: bestMatch.imageUrl },
                        );
                    }
                })
                .catch(() => {
                    if (!controller.signal.aborted) {
                        setSuggestions([]);
                    }
                })
                .finally(() => {
                    if (!controller.signal.aborted) {
                        setSearching(false);
                    }
                });
        }, 350);

        return () => {
            controller.abort();
            window.clearTimeout(timer);
        };
    }, [query, anime.isManga, open]);

    useEffect(() => {
        if (!open || !query.trim()) {
            return;
        }

        const closeSuggestionsOnFocusOutside = (event: FocusEvent) => {
            if (!(event.target instanceof Node)) {
                return;
            }

            const titleRegion = document.getElementById('entry-title')?.parentElement;
            if (titleRegion && !titleRegion.contains(event.target)) {
                setQuery('');
                setSuggestions([]);
            }
        };

        document.addEventListener('focusin', closeSuggestionsOnFocusOutside);
        return () => document.removeEventListener('focusin', closeSuggestionsOnFocusOutside);
    }, [open, query]);

    const update = <K extends keyof AnimeDraftType>(key: K, value: AnimeDraftType[K]) =>
        setAnime((current) => ({ ...current, [key]: value }));

    const applySuggestion = (suggestion: AnimeSearchResultType, useTitle: boolean) => {
        setAnime((current) => ({
            ...current,
            ...(useTitle ? { title: suggestion.title } : {}),
            imageUrl: suggestion.imageUrl,
        }));
        setQuery('');
        setSuggestions([]);
    };

    const statusOptions = useMemo(() => Object.values(AnimeStatusValues), []);
    const isBeyondPerfect = anime.rating === 11;

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!anime.title.trim()) {
            setError('Give this entry a title before saving.');
            return;
        }

        setLoading(true);
        const result = await onSave({
            ...anime,
            title: anime.title.trim(),
            link: anime.link || null,
            note: anime.note || null,
            imageUrl: anime.imageUrl || null,
        });
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Could not save this entry.');
        }
    };

    return (
        <Transition
            show={open}
            as={Fragment}
        >
            <Dialog
                onClose={onClose}
                className="relative z-50"
            >
                <TransitionChild
                    as={Fragment}
                    enter="transition-opacity duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition duration-300 ease-out"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition duration-200 ease-in"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto flex h-full w-screen max-w-2xl flex-col bg-(--surface) shadow-2xl">
                                    <div className="flex items-center justify-between border-(--border) border-b px-5 py-5 sm:px-8">
                                        <DialogTitle className="display-font font-bold text-xl">
                                            {anime.id ? 'Edit entry' : 'Add to your log'}
                                        </DialogTitle>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn-ghost h-11 min-h-11 w-11 shrink-0 p-0 text-(--text)"
                                            aria-label="Close editor"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="font-light text-5xl leading-none"
                                            >
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    <form
                                        className="flex min-h-0 flex-1 flex-col"
                                        onSubmit={(event) => void submit(event)}
                                    >
                                        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-8">
                                            {error && (
                                                <div
                                                    className="rounded-xl border border-(--danger)/30 bg-(--danger)/10 p-3 font-semibold text-(--danger) text-sm"
                                                    role="alert"
                                                >
                                                    {error}
                                                </div>
                                            )}
                                            <section className="space-y-4">
                                                <div>
                                                    <p className="muted font-bold text-xs uppercase tracking-widest">
                                                        Type
                                                    </p>
                                                    <h2 className="display-font mt-1 font-bold text-lg">
                                                        What are you logging?
                                                    </h2>
                                                </div>
                                                <div className="flex rounded-xl border border-(--border) p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => update('isManga', false)}
                                                        className={cn(
                                                            'flex-1 rounded-lg px-3 py-2.5 font-bold text-sm',
                                                            !anime.isManga ? 'bg-(--accent) text-white' : 'muted',
                                                        )}
                                                    >
                                                        Anime
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => update('isManga', true)}
                                                        className={cn(
                                                            'flex-1 rounded-lg px-3 py-2.5 font-bold text-sm',
                                                            anime.isManga ? 'bg-(--accent) text-white' : 'muted',
                                                        )}
                                                    >
                                                        Manga
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <label
                                                        htmlFor="entry-title"
                                                        className="mb-2 block font-bold text-sm"
                                                    >
                                                        Title
                                                    </label>
                                                    <input
                                                        id="entry-title"
                                                        className="field"
                                                        value={anime.title}
                                                        onChange={(event) => {
                                                            update('title', event.target.value);
                                                            setQuery(event.target.value);
                                                        }}
                                                        placeholder="e.g. Frieren: Beyond Journey's End"
                                                        maxLength={250}
                                                        required
                                                        autoFocus
                                                    />
                                                    {query && !anime.hasCustomImage && (
                                                        <div className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-xl">
                                                            {searching && (
                                                                <p className="muted flex items-center gap-2 p-3 text-sm">
                                                                    <LoaderCircle
                                                                        size={15}
                                                                        className="animate-spin"
                                                                    />{' '}
                                                                    Searching Kitsu...
                                                                </p>
                                                            )}
                                                            {!searching &&
                                                                suggestions.map((suggestion) => (
                                                                    <div
                                                                        key={suggestion.id}
                                                                        className="flex min-w-0 items-center gap-3 border-(--border) border-b p-3 last:border-b-0"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                suggestion.imageUrl ||
                                                                                '/placeholder.jpg'
                                                                            }
                                                                            alt=""
                                                                            className="h-12 w-9 shrink-0 rounded object-cover"
                                                                        />
                                                                        <span className="min-w-0 flex-1">
                                                                            <span className="block truncate font-semibold text-sm">
                                                                                {suggestion.title}
                                                                            </span>
                                                                            <span className="muted text-xs">
                                                                                Kitsu suggestion
                                                                            </span>
                                                                        </span>
                                                                        <div className="flex shrink-0 gap-1">
                                                                            <button
                                                                                type="button"
                                                                                className="btn-primary h-6 min-h-6 whitespace-nowrap px-1.5 py-0 text-[0.6rem] leading-none"
                                                                                onClick={() =>
                                                                                    applySuggestion(suggestion, true)
                                                                                }
                                                                                aria-label={`Use title and cover from ${suggestion.title}`}
                                                                                title="Use title + cover"
                                                                            >
                                                                                Title + cover
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-secondary h-6 min-h-6 whitespace-nowrap px-1.5 py-0 text-[0.6rem] leading-none"
                                                                                onClick={() =>
                                                                                    applySuggestion(suggestion, false)
                                                                                }
                                                                                aria-label={`Use cover only from ${suggestion.title}`}
                                                                                title="Use cover only"
                                                                            >
                                                                                Cover only
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            {!searching && !suggestions.length && (
                                                                <p className="muted p-3 text-xs">
                                                                    No matches. You can keep your custom title and add a
                                                                    cover URL below.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="muted text-xs">
                                                    Choose <strong>Title + cover</strong> to use both, or{' '}
                                                    <strong>Cover only</strong> to keep your title.
                                                </p>
                                            </section>
                                            <section className="space-y-4">
                                                <div>
                                                    <p className="muted font-bold text-xs uppercase tracking-widest">
                                                        Cover
                                                    </p>
                                                    <h2 className="display-font mt-1 font-bold text-lg">
                                                        Make it recognizable
                                                    </h2>
                                                </div>
                                                <div className="flex gap-4">
                                                    <img
                                                        src={anime.imageUrl || '/placeholder.jpg'}
                                                        alt="Selected cover preview"
                                                        className="h-36 w-24 shrink-0 rounded-xl object-cover"
                                                    />
                                                    <div className="min-w-0 flex-1 space-y-3">
                                                        <label className="flex items-center gap-2 font-semibold text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={anime.hasCustomImage}
                                                                onChange={(event) =>
                                                                    update('hasCustomImage', event.target.checked)
                                                                }
                                                            />{' '}
                                                            Use a custom image URL
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                className="field"
                                                                type="url"
                                                                disabled={!anime.hasCustomImage}
                                                                value={anime.imageUrl || ''}
                                                                onChange={(event) =>
                                                                    update('imageUrl', event.target.value)
                                                                }
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                        <p className="muted flex items-center gap-1 text-xs">
                                                            <ImagePlus size={14} /> Automatic suggestions come from
                                                            Kitsu.
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                            <section className="space-y-4">
                                                <div>
                                                    <p className="muted font-bold text-xs uppercase tracking-widest">
                                                        Library status
                                                    </p>
                                                    <h2 className="display-font mt-1 font-bold text-lg">
                                                        Where is it in your journey?
                                                    </h2>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                                    {statusOptions.map((status) => (
                                                        <button
                                                            type="button"
                                                            key={status}
                                                            onClick={() => update('status', status)}
                                                            className={cn(
                                                                'rounded-xl border px-2 py-3 font-bold text-xs',
                                                                anime.status === status
                                                                    ? animeStatusClasses[status]
                                                                    : 'muted border-(--border)',
                                                            )}
                                                        >
                                                            {animeStatusLabels[status]}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3 rounded-xl bg-(--surface-muted) p-3">
                                                    <Star
                                                        size={18}
                                                        className={cn(
                                                            anime.favorite ? 'fill-current text-amber-500' : 'muted',
                                                        )}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm">Favorite</p>
                                                        <p className="muted text-xs">Keep this entry easy to find.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => update('favorite', !anime.favorite)}
                                                        className={cn(
                                                            'relative h-7 w-12 rounded-full transition',
                                                            anime.favorite ? 'bg-(--accent)' : 'bg-(--surface-strong)',
                                                        )}
                                                        aria-label="Toggle favorite"
                                                    >
                                                        <span
                                                            className={cn(
                                                                'absolute top-1 h-5 w-5 rounded-full bg-white transition',
                                                                anime.favorite ? 'left-6' : 'left-1',
                                                            )}
                                                        />
                                                    </button>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="rating"
                                                        className="mb-2 flex justify-between font-bold text-sm"
                                                    >
                                                        <span>Rating</span>
                                                        <span
                                                            className={cn(
                                                                isBeyondPerfect
                                                                    ? 'rating-value-beyond'
                                                                    : 'text-(--accent-strong)',
                                                            )}
                                                            aria-live="polite"
                                                        >
                                                            {isBeyondPerfect && (
                                                                <Sparkles
                                                                    size={14}
                                                                    className="rating-beyond-sparkle"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                            {anime.rating}/10
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="rating"
                                                        className={cn(
                                                            'w-full',
                                                            isBeyondPerfect
                                                                ? 'rating-slider-beyond'
                                                                : 'accent-(--accent)',
                                                        )}
                                                        type="range"
                                                        min="0"
                                                        max="11"
                                                        step="1"
                                                        value={anime.rating}
                                                        aria-valuetext={
                                                            isBeyondPerfect
                                                                ? '11 out of 10, beyond perfect'
                                                                : `${anime.rating} out of 10`
                                                        }
                                                        onChange={(event) =>
                                                            update('rating', Number(event.target.value))
                                                        }
                                                    />
                                                </div>
                                            </section>
                                            <section className="space-y-4">
                                                <div>
                                                    <p className="muted font-bold text-xs uppercase tracking-widest">
                                                        Tracking
                                                    </p>
                                                    <h2 className="display-font mt-1 font-bold text-lg">
                                                        Add what you watched
                                                    </h2>
                                                </div>
                                                <div className="grid gap-5 sm:grid-cols-3">
                                                    <NumberChips
                                                        label="Seasons"
                                                        values={anime.seasons}
                                                        onChange={(values) => update('seasons', values)}
                                                    />
                                                    <NumberChips
                                                        label="Movies"
                                                        values={anime.movies}
                                                        onChange={(values) => update('movies', values)}
                                                    />
                                                    <NumberChips
                                                        label="OVAs"
                                                        values={anime.ovas}
                                                        onChange={(values) => update('ovas', values)}
                                                    />
                                                </div>
                                            </section>
                                            <section className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="start-date"
                                                        className="mb-2 block font-bold text-sm"
                                                    >
                                                        Start date
                                                    </label>
                                                    <input
                                                        id="start-date"
                                                        className="field"
                                                        type="date"
                                                        value={
                                                            anime.startDate
                                                                ? new Date(anime.startDate).toISOString().slice(0, 10)
                                                                : ''
                                                        }
                                                        onChange={(event) =>
                                                            update(
                                                                'startDate',
                                                                event.target.value
                                                                    ? new Date(`${event.target.value}T00:00:00`)
                                                                    : null,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="entry-link"
                                                        className="mb-2 block font-bold text-sm"
                                                    >
                                                        External link
                                                    </label>
                                                    <input
                                                        id="entry-link"
                                                        className="field"
                                                        type="url"
                                                        value={anime.link || ''}
                                                        onChange={(event) => update('link', event.target.value)}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="entry-note"
                                                        className="mb-2 block font-bold text-sm"
                                                    >
                                                        Note
                                                    </label>
                                                    <textarea
                                                        id="entry-note"
                                                        className="field min-h-28 resize-y"
                                                        value={anime.note || ''}
                                                        onChange={(event) => update('note', event.target.value)}
                                                        placeholder="A thought, recommendation, or reminder..."
                                                        maxLength={1000}
                                                    />
                                                </div>
                                            </section>
                                        </div>
                                        <div className="flex gap-3 border-(--border) border-t bg-(--surface) px-5 py-4 sm:px-8">
                                            <button
                                                type="button"
                                                className="btn-secondary flex-1"
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn-primary flex-1"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <LoaderCircle
                                                            size={17}
                                                            className="animate-spin"
                                                        />{' '}
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={17} /> Save entry
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
