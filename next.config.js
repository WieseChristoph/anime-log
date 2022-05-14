/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["cdn.discordapp.com", "s.gravatar.com"],
	},
};

module.exports = nextConfig;
