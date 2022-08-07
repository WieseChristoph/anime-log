import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/dbConnect";
import ApiResponse from "../../../../../types/ApiResponse";
import Log from "../../../../../types/Log";
import { Error } from "mongoose";
import LogModel from "../../../../../models/LogModel";

// PATH: /api/log/shared/anime
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const shareId = req.query.shareId as string;
		await dbConnect();

		if (req.method == "GET") {
			return LogModel.findOne({ shareId: shareId })
				.select({ _id: 0, anime: 1 })
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
		} else {
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
