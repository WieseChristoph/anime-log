'use client';

import Head from 'next/head';
import { useInView } from 'react-intersection-observer';
import { BookOpen, CheckCircle2, LibraryBig, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Anime, AnimeDraft } from '@/types/anime';
import { trpc } from '@/utils/trpc';
import useLog from '@/hooks/use-log';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';
import EntryCard from '@/components/log/entry-card';
import EntryListRow from '@/components/log/entry-list-row';
import EntryEditorDrawer, { createBlankAnime } from '@/components/log/entry-editor-drawer';
import LogToolbar from '@/components/log/log-toolbar';

type LogProps = { shareId?: string };
type ViewMode = 'grid' | 'list';

export default function Log({ shareId }: LogProps) {
    const [editorOpen, setEditorOpen] = useState(false);
    const [animeToEdit, setAnimeToEdit] = useState<Anime | undefined>();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const { getAnime, addAnime, updateAnime, deleteAnime, getAnimeSummary, logOptions, setLogOptions } = useLog(shareId);
    const getUserByShareId = trpc.user.getByShareId.useQuery({ shareId: shareId ?? '' }, { enabled: Boolean(shareId) });
    const { ref: inViewRef } = useInView({ onChange: (inView) => inView && getAnime.hasNextPage && void getAnime.fetchNextPage() });

    useEffect(() => {
        const saved = window.localStorage.getItem('anime-log-view');
        if (saved === 'grid' || saved === 'list') setViewMode(saved);
    }, []);

    const pages = getAnime.data?.pages.flatMap((page) => page.items) ?? [];
    const displayName = getUserByShareId.data?.name || 'Shared library';

    const changeView = (mode: ViewMode) => { setViewMode(mode); window.localStorage.setItem('anime-log-view', mode); };
    const openCreate = () => { setAnimeToEdit(undefined); setEditorOpen(true); };
    const openEdit = (anime: Anime) => { setAnimeToEdit(anime); setEditorOpen(true); };

    async function saveEntry(draft: AnimeDraft) {
        try {
            if (draft.id && draft.createdAt && draft.updatedAt) {
                await updateAnime.mutateAsync({ ...draft, id: draft.id, createdAt: draft.createdAt, updatedAt: draft.updatedAt });
            } else {
                const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...newEntry } = { ...createBlankAnime(), ...draft };
                await addAnime.mutateAsync(newEntry);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Could not save this entry.' };
        }
    }

    const toggleFavorite = (anime: Anime) => { if (!shareId) void updateAnime.mutateAsync({ ...anime, favorite: !anime.favorite }); };

    if (getAnime.isError || getUserByShareId.isError) return <div className="page-frame py-8"><ErrorAlert message={getAnime.error?.message || getUserByShareId.error?.message} /></div>;
    if (getUserByShareId.isFetched && !getUserByShareId.data) return <div className="page-frame py-8"><ErrorAlert message="No log with this id." /></div>;

    return <>
        {getUserByShareId.data && <Head><title>{displayName}&apos;s Log | Anime Log</title></Head>}
        <div className="page-frame py-4 sm:py-6">
            <section className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <div className="surface rounded-xl px-3 py-2.5 sm:rounded-2xl sm:p-4"><div className="muted flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wider"><LibraryBig size={14} /> Entries</div><p className="display-font mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">{getAnimeSummary.data?.entries ?? '—'}</p></div>
                <div className="surface rounded-xl px-3 py-2.5 sm:rounded-2xl sm:p-4"><div className="muted flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wider"><CheckCircle2 size={14} /> Completed</div><p className="display-font mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">{getAnimeSummary.data?.completed ?? '—'}</p></div>
                <div className="surface rounded-xl px-3 py-2.5 sm:rounded-2xl sm:p-4"><div className="muted flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wider"><Sparkles size={14} /> Watching</div><p className="display-font mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">{getAnimeSummary.data?.watching ?? '—'}</p></div>
                <div className="surface rounded-xl px-3 py-2.5 sm:rounded-2xl sm:p-4"><div className="muted flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wider"><BookOpen size={14} /> Manga</div><p className="display-font mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">{getAnimeSummary.data?.manga ?? '—'}</p></div>
            </section>
            <LogToolbar options={logOptions} onChange={setLogOptions} viewMode={viewMode} onViewModeChange={changeView} onAddEntry={shareId ? undefined : openCreate} />
            <EntryEditorDrawer open={editorOpen} initialAnime={animeToEdit} onClose={() => { setEditorOpen(false); setAnimeToEdit(undefined); }} onSave={saveEntry} />
            {getAnime.isLoading ? <Loading /> : pages.length === 0 ? <div className="surface mt-6 rounded-2xl px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-(--accent-soft) text-(--accent-strong)"><LibraryBig /></div><h2 className="display-font mt-5 text-xl font-bold">Nothing here yet</h2><p className="muted mx-auto mt-2 max-w-md">Try changing your filters or add your first entry to start building your collection.</p>{!shareId && <button type="button" className="btn-primary mx-auto mt-5" onClick={openCreate}><Plus size={17} /> Add your first entry</button>}</div> : viewMode === 'grid' ? <div className="mt-6 grid items-start grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{pages.map((anime) => <EntryCard key={anime.id} anime={anime} readOnly={Boolean(shareId)} onEdit={openEdit} onDelete={(entry) => deleteAnime.mutate(entry)} onFavorite={toggleFavorite} />)}</div> : <div className="surface mt-6 overflow-hidden rounded-2xl">{pages.map((anime) => <EntryListRow key={anime.id} anime={anime} readOnly={Boolean(shareId)} onEdit={openEdit} onDelete={(entry) => deleteAnime.mutate(entry)} onFavorite={toggleFavorite} />)}</div>}
            <div ref={inViewRef} className={getAnime.hasNextPage ? 'py-6' : 'hidden'}><Loading /></div>
        </div>
    </>;
}
