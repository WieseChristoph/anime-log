import type { Metadata } from 'next';
import Providers from '@/app/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Anime Log',
    description: 'Manage and share your watched anime and manga.',
    icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
