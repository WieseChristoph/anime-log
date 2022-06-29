/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"cdn.discordapp.com",
			"s.gravatar.com",
			"media.kitsu.io",
			"via.placeholder.com",
		],
	},
};

module.exports = nextConfig;
