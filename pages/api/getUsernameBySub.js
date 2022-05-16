// PATH: /api/getUsernameBySub
export default async function handler(req, res) {
	if (req.method == "GET") {
		const sub = req.query.sub;
		// oauth2|discord|12913234320673792: split at | and get last element (12913234320673792)
		let id = sub.split("|").pop();

		let response = await fetch(`https://discord.com/api/v9/users/${id}`, {
			headers: {
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
			},
		});
		if (response.ok) {
			let data = await response.json();
			res.status(200).json(data.username);
		} else
			res.status(500).json({
				error: "Error while retrieving username by sub",
			});
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
}
