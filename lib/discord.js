export const getUsernameBySub = async (sub) => {
	// need to use full url because its server side (AUTH0_BASE_URL is just the URL of the server)
	let response = await fetch(
		`${process.env.AUTH0_BASE_URL}/api/getUsernameBySub?sub=${sub}`
	);

	if (response.ok) {
		let data = await response.json();
		return data;
	}
	return "";
};
