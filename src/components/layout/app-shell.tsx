'use client';

import Snowfall from 'react-snowfall';
import Navbar from '@/components/navbar/navbar';

type AppShellProps = {
    children: React.ReactNode;
    shareId?: string;
};

export default function AppShell({ children, shareId }: AppShellProps) {
    return (
        <div className="app-shell">
            {new Date().getMonth() === 11 && <Snowfall style={{ zIndex: 100, pointerEvents: 'none' }} />}
            <Navbar urlShareId={shareId} />
            <main>{children}</main>
        </div>
    );
}
