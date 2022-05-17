import useSWR from "swr";

const useShareId = () => {
	const { data: shareId, mutate: mutateShareId } = useSWR(
		"/api/sharedLog/getId"
	);

	const createShareId = () => {
		fetch("/api/sharedLog", { method: "PUT" })
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutateShareId(data))
			.catch((error) => console.error(error.message));
	};

	const deleteShareId = () => {
		fetch("/api/sharedLog", {
			method: "DELETE",
			body: JSON.stringify(shareId),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then(() => mutateShareId(null))
			.catch((error) => console.error(error.message));
	};

	return { shareId, createShareId, deleteShareId };
};

export default useShareId;
