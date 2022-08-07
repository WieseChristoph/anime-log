import { Types } from "mongoose";

export default interface Anime {
	_id?: Types.ObjectId;
	title: string;
	imageUrl?: string;
	link?: string;
	rating: number;
	startDate?: Date;
	lastUpdated?: Date;
	seasons: number[];
	movies: number[];
	ovas: number[];
	note?: string;
}

export function isAnime(anime: Anime) {
	return (
		typeof anime.title === "string" &&
		typeof anime.rating === "number" &&
		Array.isArray(anime.seasons) &&
		Array.isArray(anime.movies) &&
		Array.isArray(anime.ovas)
	);
}
