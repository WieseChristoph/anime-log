async function kitsuRequest(url: string) {
	let response = await fetch(url, {
		headers: {
			Accept: `application/vnd.api+json`,
		},
	});
	if (response.ok) {
		let result = await response.json();
		return result;
	}
	return null;
}

export const getImageByTitle = async (
	title: string
): Promise<string | undefined> => {
	// check for anime Image
	let result = await kitsuRequest(
		`https://kitsu.io/api/edge/anime?fields[anime]=posterImage&page[limit]=1&filter[text]=${encodeURI(
			title
		)}`
	);

	// if no result for anime, check for manga Image
	if (!result || result.meta.count == 0)
		result = await kitsuRequest(
			`https://kitsu.io/api/edge/manga?fields[manga]=posterImage&page[limit]=1&filter[text]=${encodeURI(
				title
			)}`
		);

	// if no result for manga or anime, return with error. Else return image
	if (!result || result.meta.count == 0) return undefined;
	else {
		let imageUrl = result.data[0].attributes.posterImage.small as string;
		return imageUrl;
	}
};
