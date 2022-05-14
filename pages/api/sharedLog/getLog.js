import { PrismaClient } from "@prisma/client";
import { isValidUUID } from "../../../lib/uuid";

const prisma = new PrismaClient();

// PATH: /api/sharedLog/getLog
export default async function handler(req, res) {
	if (req.method == "GET") {
		const shareId = req.query.shareId;

		if (!isValidUUID(shareId))
			return res.status(500).json({
				error: "Error invalid UUID",
			});

		try {
			const result = await prisma.sharedLog.findFirst({
				where: {
					shareId: shareId,
				},
				select: {
					userId: true,
				},
			});

			const entries = await prisma.anime.findMany({
				where: {
					userId: result.userId,
				},
			});

			return res.status(200).json(entries);
		} catch (error) {
			console.error("Request error", error);
			res.status(500).json({
				error: "Error retrieving shared log",
			});
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
}
