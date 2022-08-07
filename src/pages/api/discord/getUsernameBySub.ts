import { NextApiRequest, NextApiResponse } from "next";
import ApiResponse from "../../../types/ApiResponse";

// PATH: /api/discord/getUsernameBySub
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		const sub = req.query.sub as string;
		// oauth2|discord|12913234320673792: split at | and get last element (12913234320673792)
		let id = sub.split("|").pop();

		let response = await fetch(`https://discord.com/api/v9/users/${id}`, {
			headers: {
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
			},
		});

		if (response.ok) {
			let data = await response.json();
			let username = data.username as string;
			res.status(200).json({
				success: true,
				data: username,
			} as ApiResponse);
		} else
			res.status(500).json({
				success: false,
				message: "No username found",
			} as ApiResponse);
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} not allowed`);
	}
}
