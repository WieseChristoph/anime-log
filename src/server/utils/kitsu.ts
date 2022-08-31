const BASE_URL = "https://kitsu.io/api/edge/";

async function kitsuRequest(query: string) {
    const response = await fetch(BASE_URL + query, {
        headers: {
            Accept: `application/vnd.api+json`,
        },
    });

    if (response.ok) return await response.json();

    return undefined;
}

export async function getImageByTitle(
    title: string
): Promise<string | undefined> {
    // check for anime Image
    let result = await kitsuRequest(
        `anime?fields[anime]=posterImage&page[limit]=1&filter[text]=${encodeURI(
            title
        )}`
    );

    // if no result for anime, check for manga Image
    if (!result || result.meta.count == 0)
        result = await kitsuRequest(
            `manga?fields[manga]=posterImage&page[limit]=1&filter[text]=${encodeURI(
                title
            )}`
        );

    // if no result for manga or anime, return with error. Else return image
    if (!result || result.meta.count == 0) return undefined;
    else {
        const imageUrl = result.data[0].attributes.posterImage.small as string;
        return imageUrl;
    }
}
