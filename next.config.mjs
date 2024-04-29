// @ts-check
/** @type {import("next").NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    images: {
        domains: ["cdn.discordapp.com", "media.kitsu.io"],
    },
};

export default nextConfig;
