import { NextApiRequest, NextApiResponse } from "next";

async function kitsuRequest(url: string) {
	let response = await fetch(url, {
		headers: {
			Accept: `application/vnd.api+json`,
		},
	});
	if (response.ok) {
		let result = await response.json();
		return result;
	}
	return null;
}

// PATH: /api/kitsu/getImageByTitle
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		const title = req.query.title as string;

		// check for anime Image
		let result = await kitsuRequest(
			`https://kitsu.io/api/edge/anime?fields[anime]=posterImage&page[limit]=1&filter[text]=${encodeURI(
				title
			)}`
		);

		// if no result for anime, check for manga Image
		if (!result || result.meta.count == 0)
			result = await kitsuRequest(
				`https://kitsu.io/api/edge/manga?fields[manga]=posterImage&page[limit]=1&filter[text]=${encodeURI(
					title
				)}`
			);

		// if no result for manga or anime, return with error. Else return image
		if (!result || result.meta.count == 0)
			res.status(500).json("Error no results for this title");
		else {
			let imageUrl = result.data[0].attributes.posterImage.small as string;
			res.status(200).json(imageUrl);
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} not allowed`);
	}
}
