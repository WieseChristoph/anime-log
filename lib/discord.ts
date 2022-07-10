export const getUsernameBySub = async (sub: string): Promise<string> => {
	// need to use full url because its server side (AUTH0_BASE_URL is just the URL of the server)
	let response = await fetch(
		`${process.env.AUTH0_BASE_URL}/api/discord/getUsernameBySub?sub=${sub}`
	);

	if (response.ok) {
		let username = (await response.json()) as string;
		return username;
	}
	return null;
};
