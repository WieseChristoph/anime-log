import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATH: /api/sharedLog/getId
export default withApiAuthRequired(async (req, res) => {
	const { user } = getSession(req, res);

	if (req.method == "GET")
		try {
			const result = await prisma.sharedLog.findUnique({
				where: {
					userId: user.sub,
				},
				select: {
					shareId: true,
				},
			});

			return res.status(200).json(result ? result.shareId : null);
		} catch (error) {
			console.error("Request error", error);
			res.status(500).json({
				error: "Error retrieving share id",
			});
		}
	else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
});
