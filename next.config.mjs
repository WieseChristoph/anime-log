// @ts-check
/** @type {import("next").NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    // needed to be off for chartJs but could be fixed in future nextJs versions
    swcMinify: false,
    images: {
        domains: ["cdn.discordapp.com", "media.kitsu.io"],
    },
};

export default nextConfig;
