import {
	withApiAuthRequired,
	getSession,
	UserProfile,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import LogModel from "../../../models/LogModel";
import Log from "../../../types/Log";
import ApiResponse from "../../../types/ApiResponse";
import { Error } from "mongoose";

// PATH: /api/log
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user }: { user: UserProfile } = getSession(req, res);
		await dbConnect();

		if (req.method == "GET") {
			return LogModel.findById(user.sub)
				.then((log: Log) =>
					res
						.status(200)
						.json({ success: true, data: log } as ApiResponse)
				)
				.catch((err: Error) =>
					res
						.status(500)
						.json({
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
