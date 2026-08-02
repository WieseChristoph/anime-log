'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { UserRoleValues } from '@/types/user';
import { trpc } from '@/utils/trpc';
import LoginButton from '@/components/navbar/login-button';
import ProfileDropdown from '@/components/navbar/profile-dropdown';
import SavedUsersDropdown from '@/components/navbar/saved-users-dropdown';

type NavbarProps = {
    urlShareId?: string;
};

const links = [
    { href: '/', label: 'My log', requiresLog: true },
    { href: '/stats', label: 'Statistics', requiresLog: true },
];

const Navbar = ({ urlShareId }: NavbarProps) => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentUser = trpc.user.me.useQuery(undefined, { enabled: status === 'authenticated' });

    const getHref = (href: string) => {
        if (!urlShareId) return href;
        return href === '/' ? `/${urlShareId}` : `${href}/${urlShareId}`;
    };

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-(--nav) text-(--nav-text) shadow-xl shadow-slate-950/10">
            <div className="page-frame flex min-h-14 items-center gap-2 py-2">
                <Link href="/" className="mr-auto flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                    <Image src="/torii-gate.png" alt="Anime Log" width={38} height={38} className="h-9 w-9 rounded-xl object-cover" priority />
                    <span className="display-font text-base font-bold tracking-tight sm:text-lg">Anime Log</span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
                    {status === 'authenticated' && <SavedUsersDropdown urlShareId={urlShareId} />}
                    {(status === 'authenticated' || urlShareId) &&
                        links.map((link) => {
                            const href = getHref(link.href);
                            const active = pathname === href;
                            return (
                                <Link
                                    key={link.href}
                                    href={href}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                        active ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    {currentUser.data?.role === UserRoleValues.ADMIN && (
                        <Link
                            href="/admin"
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                pathname === '/admin' ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'
                            }`}
                        >
                            Admin
                        </Link>
                    )}
                    <Link href="https://github.com/WieseChristoph/anime-log" target="_blank" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/8 hover:text-white">
                        About
                    </Link>
                </nav>

                <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((open) => !open)}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {status !== 'loading' && (status === 'authenticated' && session?.user ? <ProfileDropdown user={session.user} /> : <LoginButton />)}
            </div>

            {mobileOpen && (
                <div className="border-t border-white/10 bg-(--nav) lg:hidden">
                    <nav className="page-frame flex flex-col gap-1 py-3" aria-label="Mobile navigation">
                        {status === 'authenticated' && <div className="px-3 py-2"><SavedUsersDropdown urlShareId={urlShareId} /></div>}
                        {(status === 'authenticated' || urlShareId) && links.map((link) => (
                            <Link key={link.href} href={getHref(link.href)} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">
                                {link.label}
                            </Link>
                        ))}
                        {currentUser.data?.role === UserRoleValues.ADMIN && (
                            <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Admin</Link>
                        )}
                        <Link href="https://github.com/WieseChristoph/anime-log" target="_blank" className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">About</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
