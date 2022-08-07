import useSWR from "swr";
import Anime from "../types/Anime";
import ApiResponse from "../types/ApiResponse";

interface ReturnTypes {
	anime: Anime[];
	addAnime: (anime: Anime) => void;
	updateAnime: (anime: Anime) => void;
	deleteAnime: (anime: Anime) => void;
	error: string;
}

function useAnime(shareId: string): ReturnTypes {
	// if share id is defined, get shared log. else get user log
	const {
		data: anime,
		mutate,
		error,
	} = useSWR<Anime[]>(
		shareId ? `/api/log/shared/anime?shareId=${shareId}` : "/api/log/anime"
	);

	if (error) console.error(error);

	function addAnime(newAnime: Anime): void {
		fetch("/api/log/anime", {
			method: "PUT",
			body: JSON.stringify(newAnime),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				const addedAnime = body.data as Anime;
				mutate([...anime, addedAnime]);
			})
			.catch((error: Error) => console.error(error.message));
	}

	function updateAnime(animeToUpdate: Anime): void {
		fetch("/api/log/anime", {
			method: "PATCH",
			body: JSON.stringify(animeToUpdate),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				const updatedAnime = body.data as Anime;
				mutate(
					anime.map((a: Anime) =>
						a._id === updatedAnime._id ? updatedAnime : a
					)
				);
			})
			.catch((error: Error) => console.error(error.message));
	}

	function deleteAnime(animeToDelete: Anime): void {
		fetch("/api/log/anime", {
			method: "DELETE",
			body: JSON.stringify(animeToDelete),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				const deletedAnime = body.data as Anime;
				mutate(anime.filter((a: Anime) => a._id !== deletedAnime._id));
			})
			.catch((error: Error) => console.error(error.message));
	}

	return {
		anime: error ? null : anime,
		addAnime,
		updateAnime,
		deleteAnime,
		error: error?.message,
	};
}

export default useAnime;
