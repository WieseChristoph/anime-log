import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { isValidUUID } from "../../../lib/uuid";

// PATH: /api/sharedLog/getUserId
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		const shareId = req.query.shareId as string;

		if (!isValidUUID(shareId))
			return res.status(500).json("Error: Invalid UUID");

		try {
			const result = await prisma.sharedLog.findFirst({
				where: {
					shareId: shareId,
				},
				select: {
					userId: true,
				},
				rejectOnNotFound: true,
			});

			if (!result)
				throw new Error("No shared log found for share id");

			res.status(200).json(result.userId);
		} catch (error) {
			res.status(500).json("Error: " + error.message);
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} not allowed`);
	}
}
