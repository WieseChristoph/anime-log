import NextAuth, { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/prisma";
import { log } from "@/server/utils/auditLog";

export const getNextAuthOptions = (ipAddress?: string): NextAuthOptions => ({
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
        signIn: ({ user }) => {
            log("auth", ipAddress, user.id, true, "Login");
            return true;
        },
    },
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const ipAddress =
        req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;

    return await NextAuth(req, res, getNextAuthOptions(ipAddress));
}
