import ApiResponse from "../types/ApiResponse";

export async function getUsernameBySub(sub: string): Promise<string> {
	// need to use full url because its server side (AUTH0_BASE_URL is just the URL of the server)
	let response = await fetch(
		`${process.env.AUTH0_BASE_URL}/api/discord/getUsernameBySub?sub=${sub}`
	);

	const body: ApiResponse = await response.json();

	if (response.ok && body.success) {
		let username = body.data as string;
		return username;
	}

	return null;
}
