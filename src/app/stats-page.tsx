'use client';

import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/app-shell';
import StatsLayout from '@/components/stats/stats-layout';
import ErrorAlert from '@/components/util/error-alert';
import Loading from '@/components/util/loading';

export default function StatsPage({ shareId }: { shareId?: string }) {
    const { status } = useSession();

    return (
        <AppShell shareId={shareId}>
            {status === 'loading' ? (
                <Loading />
            ) : status === 'authenticated' || shareId ? (
                <StatsLayout shareId={shareId} />
            ) : (
                <div className="page-frame py-8">
                    <ErrorAlert message="Sign in to access your statistics." />
                </div>
            )}
        </AppShell>
    );
}
