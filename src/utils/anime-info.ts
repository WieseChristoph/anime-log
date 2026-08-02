import { z } from 'zod';

const BASE_URL = 'https://kitsu.app/api/edge';

const KitsuResponseSchema = z.object({
    data: z.array(
        z.object({
            id: z.string(),
            attributes: z
                .object({
                    canonicalTitle: z.string().nullish(),
                    titles: z
                        .object({
                            en: z.string().optional(),
                            en_jp: z.string().optional(),
                            ja_jp: z.string().optional(),
                        })
                        .passthrough(),
                    posterImage: z.object({ small: z.string() }).nullable().optional(),
                })
                .passthrough(),
        })
        .passthrough(),
    ),
}).passthrough();

export type AnimeSearchResult = {
    id: string;
    title: string;
    imageUrl: string;
    isManga: boolean;
};

async function kitsuRequest(query: string, signal?: AbortSignal) {
    const response = await fetch(`${BASE_URL}/${query}`, {
        headers: {
            Accept: `application/vnd.api+json`,
        },
        signal,
    });

    if (response.ok) {
        const result = KitsuResponseSchema.safeParse(await response.json());
        return result.success ? result.data : undefined;
    }

    return undefined;
}

export async function getImageByTitle(title: string, isManga: boolean): Promise<string> {
    const result = await kitsuRequest(
        `${isManga ? 'manga' : 'anime'}?fields[${isManga ? 'manga' : 'anime'}]=posterImage&page[limit]=1&filter[text]=${encodeURI(title)}`,
    );

    return result?.data[0]?.attributes.posterImage?.small ?? '';
}

export async function searchTitles(title: string, isManga: boolean, signal?: AbortSignal): Promise<AnimeSearchResult[]> {
    if (!title.trim()) return [];
    const type = isManga ? 'manga' : 'anime';
    const result = await kitsuRequest(
        `${type}?fields[${type}]=posterImage,titles,canonicalTitle&page[limit]=5&filter[text]=${encodeURIComponent(title.trim())}`,
        signal,
    );

    return (result?.data ?? []).map((item) => {
        const attributes = item.attributes;
        return {
            id: item.id,
            title: attributes.titles.en || attributes.canonicalTitle || attributes.titles.en_jp || 'Untitled',
            imageUrl: attributes.posterImage?.small || '',
            isManga,
        };
    });
}
