import type { Metadata } from 'next';
import Providers from '@/app/providers';
import '@/styles/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
const socialImageUrl = siteUrl ? new URL('/torii-gate.png', siteUrl).toString() : '/torii-gate.png';
const faviconUrl = siteUrl ? new URL('/favicon.ico', siteUrl).toString() : '/favicon.ico';

export const metadata: Metadata = {
    metadataBase,
    title: {
        default: 'Anime Log',
        template: '%s | Anime Log',
    },
    description: 'Manage and share your watched anime and manga.',
    applicationName: 'Anime Log',
    keywords: ['anime tracker', 'manga tracker', 'anime log', 'watchlist'],
    alternates: siteUrl ? { canonical: siteUrl } : undefined,
    openGraph: {
        ...(siteUrl ? { url: siteUrl } : {}),
        type: 'website',
        siteName: 'Anime Log',
        title: 'Anime Log',
        description: 'Manage and share your watched anime and manga.',
        images: [{ url: socialImageUrl, width: 512, height: 512, alt: 'Anime Log torii gate' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Anime Log',
        description: 'Manage and share your watched anime and manga.',
        images: [socialImageUrl],
    },
    robots: { index: true, follow: true },
    icons: { icon: [{ url: faviconUrl, type: 'image/x-icon' }] },
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
