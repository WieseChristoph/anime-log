'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

type ProvidersProps = {
    children: React.ReactNode;
    session?: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
        }),
    );

    return (
        <SessionProvider session={session}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </trpc.Provider>
        </SessionProvider>
    );
}
