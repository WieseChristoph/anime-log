import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getImageByTitle } from "../../../lib/kitsu";
import { Anime } from "@prisma/client";

// PATH: /api/log/anime
export default withApiAuthRequired(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { user } = getSession(req, res);
		const reqAnime = req.body ? (JSON.parse(req.body) as Anime) : null;

		switch (req.method) {
			case "PUT":
				try {
					const addedAnime = await prisma.anime.create({
						data: {
							...reqAnime,
							image: await getImageByTitle(reqAnime.title),
							userId: user.sub,
						},
					});

					res.status(200).json(addedAnime);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			case "PATCH":
				try {
					await prisma.anime.updateMany({
						data: {
							...reqAnime,
							image: await getImageByTitle(reqAnime.title),
							userId: user.sub,
							lastUpdate: undefined,
						},
						where: {
							id: reqAnime.id,
							userId: user.sub,
						},
					});

					// get updated entry because updateMany doesn't do it
					const updatedAnime = await prisma.anime.findUnique({
						where: {
							id: reqAnime.id,
						},
					});

					res.status(200).json(updatedAnime);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			case "DELETE":
				try {
					const { count } = await prisma.anime.deleteMany({
						where: {
							id: reqAnime.id,
							userId: user.sub,
						},
					});

					res.status(200).json(count === 1);
				} catch (error) {
					res.status(500).json("Error: " + error.message);
				}
				break;
			default:
				res.setHeader("Allow", ["PUT", "PATCH", "DELETE"]);
				res.status(405).end(`Method ${req.method} not allowed`);
		}
	}
);
