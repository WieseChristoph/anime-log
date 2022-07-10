import useSWR from "swr";
import { Anime } from "@prisma/client";

interface ReturnTypes {
	log: Anime[];
	addAnime: (anime: Anime) => void;
	updateAnime: (anime: Anime) => void;
	deleteAnime: (anime: Anime) => void;
	error: string;
}

const useLog = (shareId: string): ReturnTypes => {
	// if share id is defined, get shared log. else get user log
	const {
		data: log,
		mutate,
		error,
	} = useSWR(
		shareId ? `/api/sharedLog/getLog?shareId=${shareId}` : "/api/log"
	);
	
	if (error) 
		console.error(error)

	const addAnime = (anime: Anime) => {
		fetch("/api/log/anime", {
			method: "PUT",
			body: JSON.stringify(anime),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((addedAnime: Anime) => mutate([...log, addedAnime]))
			.catch((error: Error) => console.error(error.message));
	};

	const updateAnime = (anime: Anime) => {
		fetch("/api/log/anime", {
			method: "PATCH",
			body: JSON.stringify(anime),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((updatedAnime: Anime) =>
				mutate(
					log.map((anime: Anime) =>
						anime.id === updatedAnime.id ? updatedAnime : anime
					)
				)
			)
			.catch((error: Error) => console.error(error.message));
	};

	const deleteAnime = (anime: Anime) => {
		fetch("/api/log/anime", {
			method: "DELETE",
			body: JSON.stringify(anime),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((isDeleted: boolean) => {
				if (isDeleted)
					mutate(log.filter((anime: Anime) => anime.id !== log.id));
			})
			.catch((error: Error) => console.error(error.message));
	};

	return {
		log: error ? null : (log as Anime[]),
		addAnime,
		updateAnime,
		deleteAnime,
		error: error?.message,
	};
};

export default useLog;
