import { KitsuResponse } from "@/types/Kitsu";

const BASE_URL = "https://kitsu.io/api/edge";

async function kitsuRequest(query: string): Promise<KitsuResponse | undefined> {
    const response = await fetch(`${BASE_URL}/${query}`, {
        headers: {
            Accept: `application/vnd.api+json`,
        },
    });

    if (response.ok) return await response.json();

    return undefined;
}

export async function getImageByTitle(title: string): Promise<string> {
    // try to get anime with this title
    let result = await kitsuRequest(
        `anime?fields[anime]=posterImage&page[limit]=1&filter[text]=${encodeURI(
            title
        )}`
    );
    if (result && result.meta.count > 0)
        return result.data[0].attributes.posterImage.small;
    else {
        // try to get manga with this title
        result = await kitsuRequest(
            `manga?fields[manga]=posterImage&page[limit]=1&filter[text]=${encodeURI(
                title
            )}`
        );
        if (result && result.meta.count > 0)
            return result.data[0].attributes.posterImage.small;
    }

    return "";
}
