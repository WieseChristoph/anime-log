import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// PATH: /api/log
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user } = getSession(req, res);

		if (req.method == "GET")
			try {
				const animeLog = await prisma.anime.findMany({
					where: {
						userId: user.sub,
					},
				});

				res.status(200).json(animeLog);
			} catch (error) {
				res.status(500).json("Error: " + error.message);
			}
		else {
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
