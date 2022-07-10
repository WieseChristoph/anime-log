import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

// PATH: /api/sharedLog
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user } = getSession(req, res);

		switch (req.method) {
			case "PUT":
				try {
					const { shareId } = await prisma.sharedLog.create({
						data: { userId: user.sub },
						select: {
							shareId: true,
						},
					});

					res.status(200).json(shareId);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			case "DELETE":
				try {
					const { shareId } = await prisma.sharedLog.delete({
						where: {
							userId: user.sub,
						},
					});

					res.status(200).json(shareId);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			default:
				res.setHeader("Allow", ["PUT", "DELETE"]);
				res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
