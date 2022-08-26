import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/prisma";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		}),
		// ...add more providers here
	],
	callbacks: {
		session: ({ session, user }) => {
			// Save the user's ID in the session
			if (session.user) session.user.id = user.id;

			return session;
		},
	},
};

export default NextAuth(authOptions);
