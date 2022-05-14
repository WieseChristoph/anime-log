import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATH: /api/sharedLog/getUserId
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
				rejectOnNotFound: true,
			});

			return res.status(200).json(result ? result.userId : null);
		} catch (error) {
			console.error("Request error", error);
			res.status(500).json({
				error: "Error retrieving user id",
			});
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
}
