import { type KitsuResponse } from "@/types/Kitsu";

const BASE_URL = "https://kitsu.io/api/edge";

async function kitsuRequest(query: string): Promise<KitsuResponse | undefined> {
    const response = await fetch(`${BASE_URL}/${query}`, {
        headers: {
            Accept: `application/vnd.api+json`,
        },
    });

    if (response.ok) return (await response.json()) as KitsuResponse;

    return undefined;
}

export async function getImageByTitle(
    title: string,
    isManga: boolean
): Promise<string> {
    const result = await kitsuRequest(
        `${isManga ? "manga" : "anime"}?fields[${
            isManga ? "manga" : "anime"
        }]=posterImage&page[limit]=1&filter[text]=${encodeURI(title)}`
    );

    if (result && result.data[0])
        return result.data[0].attributes.posterImage.small;

    return "";
}
