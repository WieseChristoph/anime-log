import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// PATH: /api/sharedLog/getId
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user } = getSession(req, res);

		if (req.method == "GET")
			try {
				const result = await prisma.sharedLog.findUnique({
					where: {
						userId: user.sub,
					},
					select: {
						shareId: true,
					}
				});

				res.status(200).json(result ? result.shareId : null);
			} catch (error) {
				res.status(500).json("Error: " + error.message);
			}
		else {
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
