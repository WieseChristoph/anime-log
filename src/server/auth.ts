import type { GetServerSidePropsContext } from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/server/db';
import { log } from '@/server/utils/audit-log';
import { UserRoleSchema } from '@/types/user';
import { updateAvatarURL } from '@/server/utils/discord';
import type { AppSession } from '@/types/session';
import { z } from 'zod';

const SessionUserIdSchema = z.object({ id: z.string() });

const requiredEnvironmentValue = (value: string | undefined, name: string): string => {
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
};

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => {
            // update the user's avatar if needed
            if (user.image)
                fetch(user.image)
                    .then((res) => {
                        if (!res.ok) updateAvatarURL(user.id).catch(console.error);
                    })
                    .catch(console.error);

            return { ...session, user: { ...session.user, id: user.id } };
        },
        signIn: ({ user }) => {
            log('auth', user.id, true, 'Login');

            // update the user's avatar
            if (user.image) updateAvatarURL(user.id).catch(console.error);

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
            clientId: requiredEnvironmentValue(process.env.DISCORD_CLIENT_ID, 'DISCORD_CLIENT_ID'),
            clientSecret: requiredEnvironmentValue(process.env.DISCORD_CLIENT_SECRET, 'DISCORD_CLIENT_SECRET'),
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
}): Promise<AppSession | null> => {
    return getServerSession(ctx.req, ctx.res, authOptions).then(async (session) => {
        if (!session) return null;
        const sessionUser = SessionUserIdSchema.safeParse(session?.user);
        if (!sessionUser.success) return null;
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.data.id },
            select: { id: true, role: true, name: true, email: true, image: true },
        });
        if (!user) return null;
        return { expires: session.expires, user: { ...user, role: UserRoleSchema.parse(user.role) } };
    });
};
