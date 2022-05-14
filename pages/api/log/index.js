import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATH: /api/log
export default withApiAuthRequired(async (req, res) => {
	const { user } = getSession(req, res);

	if (req.method == "GET")
		try {
			const entries = await prisma.anime.findMany({
				where: {
					userId: user.sub,
				},
			});

			return res.status(200).json(entries);
		} catch (error) {
			console.error("Request error", error);
			res.status(500).json({
				error: "Error retrieving entries",
			});
		}
	else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
});
