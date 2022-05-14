import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATH: /api/log/anime
export default withApiAuthRequired(async (req, res) => {
	const { user } = getSession(req, res);
	const body = req.body ? JSON.parse(req.body) : {};

	switch (req.method) {
		case "PUT":
			try {
				const newEntry = await prisma.anime.create({
					data: {
						...body,
						userId: user.sub,
					},
				});

				return res.status(200).json(newEntry);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error creating entry",
				});
			}
			break;
		case "PATCH":
			// set lastUpdate to null, so the database generates it
			body.lastUpdate = null;
			try {
				const updatedEntry = await prisma.anime.updateMany({
					data: {
						...body,
						userId: user.sub,
					},
					where: {
						id: body.id,
						userId: user.sub,
					},
				});

				return res.status(200).json(updatedEntry);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error updating entry",
				});
			}
			break;
		case "DELETE":
			try {
				const deletedEntry = await prisma.anime.deleteMany({
					where: {
						id: body.id,
						userId: user.sub,
					},
				});

				return res.status(200).json(deletedEntry);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error deleting entry",
				});
			}
			break;
		default:
			res.setHeader("Allow", ["PUT", "PATCH", "DELETE"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
});
