import type { GetServerSidePropsContext } from 'next';
import type { NextAuthOptions, DefaultSession } from 'next-auth';
import { getServerSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/server/db';
import { log } from '@/server/utils/audit-log';
import type { UserRoleType } from '@/types/user';
import { updateAvatarURL } from '@/server/utils/discord';

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRoleType;
        } & DefaultSession['user'];
    }

    interface User {
        role: UserRoleType;
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
                session.user.role = user.role as UserRoleType;
            }

            // update the user's avatar if needed
            if ((user as { image?: string | null }).image)
                fetch((user as { image?: string | null }).image as string)
                    .then((res) => {
                        if (!res.ok) updateAvatarURL(user.id).catch(console.error);
                    })
                    .catch(console.error);

            return session;
        },
        signIn: ({ user }) => {
            log('auth', user.id, true, 'Login');

            // update the user's avatar
            if ((user as { image?: string | null }).image) updateAvatarURL(user.id).catch(console.error);

            return true;
        },
    },
    session: {
        // set max update age of session to 5 min (for "last online")
        updateAge: 5 * 60,
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
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
