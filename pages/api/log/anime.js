import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { getIdByTitle } from "../../../lib/kitsu";

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
						kitsuId: await getIdByTitle(body.title),
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
			try {
				const result = await prisma.anime.updateMany({
					data: {
						...body,
						kitsuId: await getIdByTitle(body.title),
						userId: user.sub,
						lastUpdate: undefined,
					},
					where: {
						id: body.id,
						userId: user.sub,
					},
				});

				// get updated entry because updateMany doesn't do it
				const updatedEntry = await prisma.anime.findUnique({
					where: {
						id: body.id,
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
				const result = await prisma.anime.deleteMany({
					where: {
						id: body.id,
						userId: user.sub,
					},
				});

				return res.status(200).json(result);
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
