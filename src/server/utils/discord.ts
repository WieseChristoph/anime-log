import { prisma } from '@/server/db';
import { z } from 'zod';

const DiscordUserSchema = z.object({ avatar: z.string().nullable() }).passthrough();

export async function updateAvatarURL(userId: string) {
    if (!process.env.DISCORD_BOT_TOKEN) {
        throw new Error('Missing Discord bot token');
    }

    const { providerAccountId } = await prisma.account.findFirstOrThrow({
        where: { userId: userId },
        select: { providerAccountId: true },
    });

    const response = await fetch(`https://discord.com/api/v10/users/${providerAccountId}`, {
        headers: new Headers({
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        }),
    });

    if (!response.ok) {
        return;
    }

    const result = DiscordUserSchema.safeParse(await response.json());
    if (!result.success) {
        return;
    }
    const data = result.data;

    if (!data.avatar) {
        return;
    }

    prisma.user
        .update({
            where: { id: userId },
            data: {
                image: `https://cdn.discordapp.com/avatars/${providerAccountId}/${data.avatar}`,
            },
        })
        .catch(console.error);
}
