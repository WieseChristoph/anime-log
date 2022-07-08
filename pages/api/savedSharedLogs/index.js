import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { prisma } from "../../../lib/db";
import { getUsernameBySub } from "../../../lib/discord";

// PATH: /api/savedSharedLogs
export default withApiAuthRequired(async (req, res) => {
	const { user } = getSession(req, res);
	const body = req.body ? JSON.parse(req.body) : {};

	switch (req.method) {
		case "GET":
			try {
				let savedLogs = await prisma.sharedLog.findMany({
					where: {
						savedBy: {
							has: user.sub,
						},
					},
					select: {
						shareId: true,
						userId: true,
					},
				});

				// add username to each saved log
				savedLogs = await Promise.all(
					savedLogs.map(async (savedLog) => ({
						shareId: savedLog.shareId,
						username: await getUsernameBySub(savedLog.userId),
					}))
				);

				return res.status(200).json(savedLogs);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error retrieving saved shared logs",
				});
			}
			break;
		case "PUT":
			try {
				const { savedBy } = await prisma.sharedLog.findUnique({
					where: {
						shareId: body.shareId,
					},
					select: {
						savedBy: true,
					},
				});

				const updatedSharedLog = await prisma.sharedLog.update({
					data: {
						savedBy: {
							set: savedBy.includes(user.sub)
								? savedBy
								: [...savedBy, user.sub],
						},
					},
					where: {
						shareId: body.shareId,
					},
					select: {
						shareId: true,
						userId: true,
					},
				});

				return res.status(200).json(updatedSharedLog);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error adding saved shared log",
				});
			}
			break;
		case "DELETE":
			try {
				const { savedBy } = await prisma.sharedLog.findUnique({
					where: {
						shareId: body.shareId,
					},
					select: {
						savedBy: true,
					},
				});

				const updatedSharedLog = await prisma.sharedLog.update({
					data: {
						savedBy: {
							set: savedBy.filter((sub) => sub !== user.sub),
						},
					},
					where: {
						shareId: body.shareId,
					},
					select: {
						shareId: true,
						userId: true,
					},
				});

				return res.status(200).json(updatedSharedLog);
			} catch (error) {
				console.error("Request error", error);
				res.status(500).json({
					error: "Error deleting saved shared log",
				});
			}
			break;
		default:
			res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
});
