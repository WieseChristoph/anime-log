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

// PATH: /api/log/shared/saved
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user }: { user: UserProfile } = getSession(req, res);
		await dbConnect();

		const body: { shareId: string } = req.body
			? await JSON.parse(req.body)
			: null;

		switch (req.method) {
			case "GET":
				return LogModel.findById(user.sub)
					.select({ _id: 0, savedSharedLogs: 1 })
					.then((log: Log) => {
						res.status(200).json({
							success: true,
							data: log?.savedSharedLogs || [],
						} as ApiResponse);
					})
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "PUT":
				return LogModel.findOne({
					shareId: body.shareId,
				})
					.then(async (sharedLog: Log) => {
						const username: string = await getOrSetCache(
							`discord_username:${sharedLog._id}`,
							() => getUsernameBySub(sharedLog._id)
						);

						return LogModel.findOneAndUpdate(
							{
								_id: user.sub,
								"savedSharedLogs.shareId": {
									$ne: body.shareId,
								},
							},
							{
								$push: {
									savedSharedLogs: {
										shareId: body.shareId,
										username: username,
									},
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
					})
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "DELETE":
				return LogModel.findByIdAndUpdate(user.sub, {
					$pull: {
						savedSharedLogs: {
							shareId: body.shareId,
						},
					},
				} as unknown)
					.select({
						_id: 0,
						savedSharedLogs: {
							$elemMatch: { shareId: body.shareId },
						},
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
