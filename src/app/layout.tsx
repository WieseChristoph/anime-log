import type { Metadata } from 'next';
import Providers from '@/app/providers';
import '@/styles/globals.css';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Anime Log',
        template: '%s | Anime Log',
    },
    description: 'Manage and share your watched anime and manga.',
    applicationName: 'Anime Log',
    keywords: ['anime tracker', 'manga tracker', 'anime log', 'watchlist'],
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        url: '/',
        siteName: 'Anime Log',
        title: 'Anime Log',
        description: 'Manage and share your watched anime and manga.',
        images: [{ url: '/torii-gate.png', width: 512, height: 512, alt: 'Anime Log torii gate' }],
    },
    twitter: {
        card: 'summary',
        title: 'Anime Log',
        description: 'Manage and share your watched anime and manga.',
        images: ['/torii-gate.png'],
    },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
