import {
	withApiAuthRequired,
	getSession,
	UserProfile,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import ApiResponse from "../../../../types/ApiResponse";
import Log from "../../../../types/Log";
import { Error } from "mongoose";
import LogModel from "../../../../models/LogModel";
import { randomUUID } from "crypto";

// PATH: /api/log/shared
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user }: { user: UserProfile } = getSession(req, res);
		await dbConnect();

		switch (req.method) {
			case "GET":
				return LogModel.findById(user.sub)
					.select({ _id: 0, shareId: 1 })
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log?.shareId || null,
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "PUT":
				return LogModel.findOneAndUpdate(
					{ _id: user.sub, shareId: null },
					{
						shareId: randomUUID(),
					},
					{ upsert: true, new: true }
				)
					.select({ _id: 0, shareId: 1 })
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.shareId,
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
					shareId: null,
				})
					.select({ _id: 0, shareId: 1 })
					.then((log: Log) => {
						// remove shared log from every user who saved it
						LogModel.updateMany(
							{
								savedSharedLogs: {
									$elemMatch: { shareId: log.shareId },
								},
							},
							{
								$pull: {
									savedSharedLogs: { shareId: log.shareId },
								},
							} as unknown
						).catch(console.error);

						res.status(200).json({
							success: true,
							data: log.shareId,
						} as ApiResponse);
					})
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
