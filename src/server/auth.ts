import { type GetServerSidePropsContext } from "next";
import { type NextAuthOptions, type DefaultSession } from "next-auth";
import { getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";
import { log } from "@/server/utils/auditLog";
import { type user_role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: user_role;
        } & DefaultSession["user"];
    }

    interface User {
        role: user_role;
    }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => {
            // Save the user's ID in the session
            if (session.user) {
                session.user.id = user.id;
                session.user.role = user.role;
            }

            return session;
        },
        signIn: ({ user }) => {
            log("auth", user.id, true, "Login");
            return true;
        },
    },
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
        // ...add more providers here
    ],
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
