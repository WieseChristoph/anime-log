'use client';

import { useState } from 'react';
import AdminNavigation, { type AdminNavItemType } from '@/components/admin/admin-navigation';
import AdminUsers from '@/components/admin/admin-users';
import AdminStats from '@/components/admin/admin-stats';

export default function AdminLayout() {
    const [activePage, setActivePage] = useState<AdminNavItemType>('stats');
    return <div className="page-frame py-6 sm:py-8"><div className="mb-6"><p className="mb-2 text-sm font-bold text-(--accent-strong)">Workspace management</p><h1 className="display-font text-3xl font-bold tracking-tight sm:text-4xl">Admin console</h1><p className="muted mt-2">Keep an eye on the community and its shared libraries.</p></div><AdminNavigation active={activePage} onNavItemChange={setActivePage} /><div className="mt-5">{activePage === 'stats' ? <AdminStats /> : <AdminUsers />}</div></div>;
}
