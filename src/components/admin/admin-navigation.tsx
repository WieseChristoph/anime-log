import { BarChart3, Users } from 'lucide-react';
import { cn } from '@/utils/helper';

export type AdminNavItemType = 'stats' | 'users';

type AdminNavigationProps = { active: AdminNavItemType; onNavItemChange: (newActive: AdminNavItemType) => void };

export default function AdminNavigation({ active, onNavItemChange }: AdminNavigationProps) {
    return (
        <nav
            className="surface flex w-full gap-1 rounded-2xl p-1"
            aria-label="Admin sections"
        >
            <button
                type="button"
                onClick={() => onNavItemChange('stats')}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm transition',
                    active === 'stats' ? 'bg-(--accent) text-white' : 'muted hover:bg-(--surface-muted)',
                )}
            >
                <BarChart3 size={17} /> Overview
            </button>
            <button
                type="button"
                onClick={() => onNavItemChange('users')}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm transition',
                    active === 'users' ? 'bg-(--accent) text-white' : 'muted hover:bg-(--surface-muted)',
                )}
            >
                <Users size={17} /> Users
            </button>
        </nav>
    );
}
