'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChevronDown, ExternalLink, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import DeleteButton from '@/components/util/delete-button';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';
import { UserRoleValues } from '@/types/user';
import { cn } from '@/utils/helper';
import { trpc } from '@/utils/trpc';

dayjs.extend(relativeTime);

export default function AdminUsers() {
    const ctx = trpc.useUtils();
    const getUsers = trpc.user.getAll.useQuery();
    const getCounts = trpc.anime.getCountByUser.useQuery();
    const getLastUpdated = trpc.anime.getLastUpdateByUser.useQuery();
    const deleteUser = trpc.user.delete.useMutation({ onSettled: () => void ctx.user.getAll.invalidate() });
    const [openUser, setOpenUser] = useState<string>();

    if (getUsers.isError || getCounts.isError || getLastUpdated.isError || deleteUser.isError) {
        return (
            <ErrorAlert
                message={
                    getUsers.error?.message ||
                    getCounts.error?.message ||
                    getLastUpdated.error?.message ||
                    deleteUser.error?.message
                }
            />
        );
    }

    if (getUsers.isLoading) {
        return <Loading />;
    }

    return (
        <div className="space-y-3">
            {getUsers.data?.map((user) => {
                const count = getCounts.data?.find((entry) => entry.userId === user.id)?._count._all ?? 0;
                const lastUpdated = getLastUpdated.data?.find((entry) => entry.userId === user.id)?.updatedAt;
                const lastSessionExpiry = user.sessions.reduce<Date | undefined>(
                    (latest, session) => (!latest || session.expires > latest ? session.expires : latest),
                    undefined,
                );
                const expanded = openUser === user.id;

                return (
                    <section
                        key={user.id}
                        className="surface overflow-hidden rounded-2xl"
                    >
                        <button
                            type="button"
                            onClick={() => setOpenUser(expanded ? undefined : user.id)}
                            className="flex w-full items-center gap-3 p-4 text-left"
                        >
                            <Image
                                src={user.image || '/placeholder.jpg'}
                                alt=""
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <span className="min-w-0 flex-1">
                                <strong className="block truncate">{user.name || 'Unnamed user'}</strong>
                                <span className="muted text-xs">
                                    {count} entries{lastUpdated ? ` · updated ${dayjs(lastUpdated).fromNow()}` : ''}
                                </span>
                            </span>
                            <span
                                className={cn(
                                    'rounded-full px-2.5 py-1 font-bold text-xs',
                                    user.role === UserRoleValues.ADMIN
                                        ? 'bg-(--accent-soft) text-(--accent-strong)'
                                        : 'muted bg-(--surface-muted)',
                                )}
                            >
                                {user.role}
                            </span>
                            <ChevronDown
                                size={18}
                                className={cn('muted transition', expanded && 'rotate-180')}
                            />
                        </button>
                        {expanded && (
                            <div className="grid gap-4 border-(--border) border-t p-4 sm:grid-cols-2">
                                <div>
                                    <p className="muted font-bold text-xs uppercase tracking-wider">Email</p>
                                    <p className="mt-1 break-all text-sm">{user.email || '—'}</p>
                                </div>
                                <div>
                                    <p className="muted font-bold text-xs uppercase tracking-wider">Last online</p>
                                    <p className="mt-1 text-sm">
                                        {lastSessionExpiry
                                            ? dayjs(lastSessionExpiry).subtract(30, 'days').format('MMM D, YYYY')
                                            : 'More than 30 days ago'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:col-span-2">
                                    {user.shareId && (
                                        <Link
                                            href={`/${user.shareId}`}
                                            target="_blank"
                                            className="btn-secondary min-h-9 text-xs"
                                        >
                                            <ExternalLink size={14} /> Open shared log
                                        </Link>
                                    )}
                                    <DeleteButton
                                        title={`Delete ${user.name || 'this user'}?`}
                                        text="This removes their account and all entries."
                                        successTitle="Deleted"
                                        successText="The user was removed."
                                        onDeleteClick={async () => {
                                            await deleteUser.mutateAsync({ userId: user.id });
                                        }}
                                        className="btn-danger min-h-9 text-xs"
                                    >
                                        <Trash2 size={14} /> Delete user
                                    </DeleteButton>
                                </div>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
