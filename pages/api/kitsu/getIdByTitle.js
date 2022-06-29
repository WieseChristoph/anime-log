// PATH: /api/kitsu/getIdByTitle
export default async function handler(req, res) {
	if (req.method == "GET") {
		const title = req.query.title;

		let response = await fetch(
			`https://kitsu.io/api/edge/anime?filter[text]=${encodeURI(title)}`,
			{
				headers: {
					Accept: `application/vnd.api+json`,
				},
			}
		);
		if (response.ok) {
			let data = await response.json();
			if (data.data.length > 0) {
				res.status(200).json(parseInt(data.data[0].id));
			} else
				res.status(404).json({
					error: "Error no results for this title",
				});
		} else
			res.status(500).json({
				error: "Error while retrieving id by title",
			});
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${method} Not Allowed`);
	}
}
