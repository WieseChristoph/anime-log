import {
	withApiAuthRequired,
	getSession,
	UserProfile,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/dbConnect";
import { getUsernameBySub } from "../../../../../lib/discord";
import LogModel from "../../../../../models/LogModel";
import Log from "../../../../../types/Log";
import ApiResponse from "../../../../../types/ApiResponse";
import { getOrSetCache } from "../../../../../lib/redis";
import SavedSharedLog from "../../../../../types/SavedSharedLog";

// PATH: /api/log/shared/saved
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user }: { user: UserProfile } = getSession(req, res);
		await dbConnect();

		const body: { shareId: string } =
			req.body && typeof req.body === "string"
				? await JSON.parse(req.body)
				: req.body;

		switch (req.method) {
			case "GET":
				return LogModel.findById(user.sub)
					.select({ _id: 0, savedSharedLogs: 1 })
					.then((log: Log) => {
						return LogModel.find({
							shareId: { $in: log.savedSharedLogs },
						})
							.then(async (logs: Log[]) => {
								// Get the username of each log
								const savedSharedLogs: SavedSharedLog[] =
									await Promise.all(
										logs.map(async (l) => ({
											shareId: l.shareId,
											username: await getOrSetCache(
												`discord_username:${l._id}`,
												() => getUsernameBySub(l._id)
											),
										}))
									);

								res.status(200).json({
									success: true,
									data: savedSharedLogs || [],
								} as ApiResponse);
							})
							.catch((err: Error) =>
								res.status(500).json({
									success: false,
									message: err.message,
								} as ApiResponse)
							);
					})
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "PUT":
				return LogModel.findOneAndUpdate(
					{
						_id: user.sub,
					},
					{
						$addToSet: {
							savedSharedLogs: body.shareId,
						},
					} as unknown,
					{ upsert: true, new: true }
				)
					.select({ _id: 0, savedSharedLogs: { $slice: -1 } })
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.savedSharedLogs[0],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "DELETE":
				return LogModel.findByIdAndUpdate(user.sub, {
					$pull: {
						savedSharedLogs: body.shareId,
					},
				} as unknown)
					.select({
						_id: 0,
						savedSharedLogs: { $elemMatch: { $eq: body.shareId } },
					})
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.savedSharedLogs[0],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			default:
				res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
				res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
