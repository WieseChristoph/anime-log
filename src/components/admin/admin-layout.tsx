import type { AdminNavItemType } from '@/components/admin/admin-navigation';
import AdminNavigation from '@/components/admin/admin-navigation';
import AdminUsers from '@/components/admin/admin-users';
import AdminStats from '@/components/admin/admin-stats';
import { useState } from 'react';

const AdminLayout = () => {
    const [activePage, setActivePage] = useState<AdminNavItemType>('stats');

    return (
        <div className="container mx-auto px-2 py-4">
            <AdminNavigation active={activePage} onNavItemChange={setActivePage} />

            {(() => {
                switch (activePage) {
                    case 'stats':
                        return <AdminStats />;
                    case 'users':
                        return <AdminUsers />;
                }
            })()}
        </div>
    );
};

export default AdminLayout;
