import { useState, type FC } from "react";
import { AdminNavItem } from "./AdminNavigation";

import AdminNavigation from "./AdminNavigation";
import AdminUsers from "./AdminUsers";
import AdminStats from "./AdminStats";

const AdminLayout: FC = () => {
    const [activePage, setActivePage] = useState(AdminNavItem.STATS);

    return (
        <div className="container mx-auto px-2 py-4">
            <AdminNavigation
                active={activePage}
                onNavItemChange={setActivePage}
            />

            {(() => {
                switch (activePage) {
                    default:
                    case AdminNavItem.STATS:
                        return <AdminStats />;
                    case AdminNavItem.USERS:
                        return <AdminUsers />;
                }
            })()}
        </div>
    );
};

export default AdminLayout;
