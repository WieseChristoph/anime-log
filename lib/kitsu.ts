export const getImageByTitle = async (title: string): Promise<string> => {
	// need to use full url because its server side (AUTH0_BASE_URL is just the URL of the server)
	let response = await fetch(
		`${process.env.AUTH0_BASE_URL}/api/kitsu/getImageByTitle?title=${title}`
	);

	if (response.ok) {
		let imageUrl = (await response.json()) as string;
		return imageUrl;
	}

	return null;
};
