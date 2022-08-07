import ApiResponse from "../types/ApiResponse";

export async function getImageByTitle(title: string): Promise<string> {
	// need to use full url because its server side (AUTH0_BASE_URL is just the URL of the server)
	let response = await fetch(
		`${process.env.AUTH0_BASE_URL}/api/kitsu/getImageByTitle?title=${title}`
	);

	const body: ApiResponse = await response.json();

	if (response.ok && body.success) {
		let imageUrl = body.data as string;
		return imageUrl;
	}

	return null;
}
