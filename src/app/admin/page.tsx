'use client';

import Head from 'next/head';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/admin-layout';
import AppShell from '@/components/layout/app-shell';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';
import { UserRoleValues } from '@/types/user';
import { trpc } from '@/utils/trpc';

export default function AdminPage() {
    const { status } = useSession();
    const currentUser = trpc.user.me.useQuery(undefined, { enabled: status === 'authenticated' });

    return (
        <AppShell>
            <Head>
                <title>Admin Panel | Anime Log</title>
            </Head>

            {status === 'loading' || currentUser.isLoading ? (
                <Loading />
            ) : status === 'authenticated' && currentUser.data?.role === UserRoleValues.ADMIN ? (
                <AdminLayout />
            ) : (
                <div className="page-frame py-8">
                    <ErrorAlert message="You need administrator access to view this page." />
                </div>
            )}
        </AppShell>
    );
}
