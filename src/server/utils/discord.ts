import { prisma } from "../db";
import type { DiscordUser } from "@/types/Discord";

export async function updateAvatarURL(userId: string) {
    if (!process.env.DISCORD_BOT_TOKEN)
        throw new Error("Missing Discord bot token");

    const { providerAccountId } = await prisma.account.findFirstOrThrow({
        where: { userId: userId },
        select: { providerAccountId: true },
    });

    const response = await fetch(
        `https://discord.com/api/v10/users/${providerAccountId}`,
        {
            headers: new Headers({
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            }),
        }
    );

    if (!response.ok) return;

    const data = (await response.json()) as DiscordUser;

    if (!data.avatar) return;

    prisma.user
        .update({
            where: { id: userId },
            data: {
                image: `https://cdn.discordapp.com/avatars/${providerAccountId}/${data.avatar}`,
            },
        })
        .catch(console.error);
}
