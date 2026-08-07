import { z } from 'zod';

const BASE_URL = 'https://kitsu.app/api/edge';

const KitsuResponseSchema = z.looseObject({
    data: z.array(
        z.looseObject({
            id: z.string(),
            attributes: z.looseObject({
                canonicalTitle: z.string().nullish(),
                titles: z.looseObject({
                    en: z.string().optional(),
                    en_jp: z.string().optional(),
                    ja_jp: z.string().optional(),
                }),
                posterImage: z.looseObject({ small: z.string() }).nullable().optional(),
            }),
        }),
    ),
});

export type AnimeSearchResultType = {
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

export async function searchTitles(
    title: string,
    isManga: boolean,
    signal?: AbortSignal,
): Promise<AnimeSearchResultType[]> {
    if (!title.trim()) {
        return [];
    }
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
