import { JikanResponse } from "@/types/Jikan";

const BASE_URL = "https://api.jikan.moe/v4";

async function jikanRequest(query: string): Promise<JikanResponse | undefined> {
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
    let result = await jikanRequest(
        `anime?q=${encodeURIComponent(title)}&limit=1`
    );
    if (result && result.data.length > 0)
        return result.data[0].images.webp.image_url;
    else {
        // try to get manga with this title
        result = await jikanRequest(
            `manga?q=${encodeURIComponent(title)}&limit=1`
        );
        if (result && result.data.length > 0)
            return result.data[0].images.webp.image_url;
    }

    return "";
}
