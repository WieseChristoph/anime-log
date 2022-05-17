import useSWR from "swr";

const useLog = (shareId) => {
	// if share id is defined, get shared log. else get user log
	const { data: entries, mutate } = useSWR(
		shareId ? `/api/sharedLog/getLog?shareId=${shareId}` : "/api/log"
	);

	const createEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "PUT",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutate([...entries, data]))
			.catch((error) => console.error(error.message));
	};

	const updateEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "PATCH",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) =>
				mutate(
					entries.map((anime) =>
						anime.id === data.id ? data : anime
					)
				)
			)
			.catch((error) => console.error(error.message));
	};

	const deleteEntry = (entry) => {
		fetch("/api/log/anime", {
			method: "DELETE",
			body: JSON.stringify(entry),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => {
				if (data.count > 0)
					mutate(entries.filter((anime) => anime.id !== entry.id));
			})
			.catch((error) => console.error(error.message));
	};

	return { entries, createEntry, updateEntry, deleteEntry };
};

export default useLog;
