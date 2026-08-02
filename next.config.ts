import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
    images: {
        remotePatterns: [new URL('https://cdn.discordapp.com/**'), new URL('https://media.kitsu.app/**')],
    },
    experimental: {
        useTypeScriptCli: true,
    },
};

export default nextConfig;
