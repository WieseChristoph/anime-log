import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getUsernameBySub } from "../../../lib/discord";

// PATH: /api/savedSharedLogs
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user } = getSession(req, res);
		const shareId = req.body
			? (JSON.parse(req.body).shareId as string)
			: null;

		switch (req.method) {
			case "GET":
				try {
					let savedSharedLogs = await prisma.sharedLog.findMany({
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
					let savedSharedLogsUsername = await Promise.all(
						savedSharedLogs.map(async (savedSharedLog) => ({
							shareId: savedSharedLog.shareId,
							username: await getUsernameBySub(
								savedSharedLog.userId
							),
						}))
					);

					res.status(200).json(savedSharedLogsUsername);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			case "PUT":
				try {
					const result = await prisma.sharedLog.findUnique({
						where: {
							shareId: shareId,
						},
						select: {
							savedBy: true,
						},
					});

					if (!result)
						throw new Error("No shared log found for share id");

					const updatedSharedLog = await prisma.sharedLog.update({
						data: {
							savedBy: {
								set: result.savedBy.includes(user.sub)
									? result.savedBy
									: [...result.savedBy, user.sub],
							},
						},
						where: {
							shareId: shareId,
						},
						select: {
							shareId: true,
							userId: true,
						},
					});

					res.status(200).json(updatedSharedLog);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			case "DELETE":
				try {
					const result = await prisma.sharedLog.findUnique({
						where: {
							shareId: shareId,
						},
						select: {
							savedBy: true,
						},
					});

					if (!result)
						throw new Error("No shared log found for share id");

					const deletedSharedLog = await prisma.sharedLog.update({
						data: {
							savedBy: {
								set: result.savedBy.filter((sub) => sub !== user.sub),
							},
						},
						where: {
							shareId: shareId,
						},
						select: {
							shareId: true,
							userId: true,
						},
					});

					res.status(200).json(deletedSharedLog);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			default:
				res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
				res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
