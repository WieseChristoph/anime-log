import type { Metadata } from 'next';
import Providers from '@/app/providers';
import '@/styles/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const socialImageUrl = new URL('/torii-gate.png', siteUrl).toString();
const faviconUrl = new URL('/favicon.ico', siteUrl).toString();

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Anime Log',
        template: '%s | Anime Log',
    },
    description: 'Manage and share your watched anime and manga.',
    applicationName: 'Anime Log',
    keywords: ['anime tracker', 'manga tracker', 'anime log', 'watchlist'],
    alternates: { canonical: siteUrl },
    openGraph: {
        type: 'website',
        url: siteUrl,
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
