'use client';

import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/app-shell';
import Log from '@/components/log/log';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';

export default function LogPage({ shareId }: { shareId?: string }) {
    const { status } = useSession();

    return (
        <AppShell shareId={shareId}>
            {status === 'loading' ? (
                <Loading />
            ) : status === 'authenticated' || shareId ? (
                <Log shareId={shareId} />
            ) : (
                <div className="page-frame py-8">
                    <ErrorAlert message="Sign in to access your own log." />
                </div>
            )}
        </AppShell>
    );
}
