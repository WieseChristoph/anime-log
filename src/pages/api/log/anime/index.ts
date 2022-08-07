import {
	withApiAuthRequired,
	getSession,
	UserProfile,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import { getImageByTitle } from "../../../../lib/kitsu";
import LogModel from "../../../../models/LogModel";
import Anime, { isAnime } from "../../../../types/Anime";
import Log from "../../../../types/Log";
import ApiResponse from "../../../../types/ApiResponse";
import { Error } from "mongoose";

// PATH: /api/log/anime
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user }: { user: UserProfile } = getSession(req, res);
		await dbConnect();

		const body: Anime = req.body ? await JSON.parse(req.body) : null;

		switch (req.method) {
			case "GET":
				return LogModel.findById(user.sub)
					.select({
						_id: 0,
						anime: 1,
					})
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log?.anime || [],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "PUT":
				console.log(body);
				if (!isAnime(body))
					return res.status(400).json({
						success: false,
						message: "Invalid anime",
					} as ApiResponse);

				body.imageUrl = await getImageByTitle(body.title);
				body._id = undefined;
				body.lastUpdated = undefined;

				return LogModel.findByIdAndUpdate(
					user.sub,
					{ $push: { anime: body } } as unknown,
					{
						upsert: true,
						new: true,
					}
				)
					.select({ _id: 0, anime: { $slice: -1 } })
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.anime[0],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "PATCH":
				if (!isAnime(body))
					return res.status(400).json({
						success: false,
						message: "Invalid anime",
					} as ApiResponse);

				// update imageUrl and lastUpdated
				body.imageUrl = await getImageByTitle(body.title);
				body.lastUpdated = new Date();

				return LogModel.findOneAndUpdate(
					{ _id: user.sub, "anime._id": body._id },
					{ $set: { "anime.$": body } },
					{ new: true }
				)
					.select({
						_id: 0,
						anime: { $elemMatch: { _id: body._id } },
					})
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.anime[0],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			case "DELETE":
				if (!("_id" in body))
					return res.status(400).json({
						success: false,
						message: "No _id in anime",
					} as ApiResponse);

				return LogModel.findOneAndUpdate(
					{
						_id: user.sub,
					},
					{ $pull: { anime: { _id: body._id } } } as unknown
				)
					.select({ _id: 0, anime: { $slice: -1 } })
					.then((log: Log) =>
						res.status(200).json({
							success: true,
							data: log.anime[0],
						} as ApiResponse)
					)
					.catch((err: Error) =>
						res.status(500).json({
							success: false,
							message: err.message,
						} as ApiResponse)
					);

			default:
				res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
				res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
