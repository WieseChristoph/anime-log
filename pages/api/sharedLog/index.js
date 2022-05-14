import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATH: /api/sharedLog
export default withApiAuthRequired(async (req, res) => {
	const { user } = getSession(req, res);

	switch (req.method) {
		case "PUT":
			try {
				const newShareId = await prisma.sharedLog.create({
					data: { userId: user.sub },
					select: {
						shareId: true,
					},
				});

				return res.status(200).json(newShareId);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error creating shared log",
				});
			}
			break;
		case "DELETE":
			try {
				const deletedShareId = await prisma.sharedLog.delete({
					where: {
						userId: user.sub,
					},
				});

				return res.status(200).json(deletedShareId);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error deleting shared log",
				});
			}
			break;
		default:
			res.setHeader("Allow", ["PUT", "DELETE"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
});
