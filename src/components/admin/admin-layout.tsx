'use client';

import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import AdminNavigation, { type AdminNavItemType } from '@/components/admin/admin-navigation';
import AdminUsers from '@/components/admin/admin-users';
import AdminStats from '@/components/admin/admin-stats';

export default function AdminLayout() {
    const [activePage, setActivePage] = useState<AdminNavItemType>('stats');

    return (
        <div className="page-frame py-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 font-bold text-(--accent-strong) text-sm">
                        <ShieldCheck size={17} /> Workspace management
                    </div>
                    <h1 className="display-font mt-2 font-bold text-3xl tracking-tight sm:text-4xl">Admin console</h1>
                </div>
            </div>

            <AdminNavigation
                active={activePage}
                onNavItemChange={setActivePage}
            />

            <div className="mt-5">{activePage === 'stats' ? <AdminStats /> : <AdminUsers />}</div>
        </div>
    );
}
