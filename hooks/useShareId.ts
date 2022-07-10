import useSWR from "swr";

interface ReturnTypes {
	shareId: string;
	createShareId: () => void;
	deleteShareId: () => void;
	error: string;
}

const useShareId = (): ReturnTypes => {
	const {
		data: shareId,
		mutate: mutateShareId,
		error,
	} = useSWR("/api/sharedLog/getId");

	if (error) 
		console.error(error)

	const createShareId = () => {
		fetch("/api/sharedLog", { method: "PUT" })
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((newShareId: string) => mutateShareId(newShareId))
			.catch((error: Error) => console.error(error.message));
	};

	const deleteShareId = () => {
		fetch("/api/sharedLog", {
			method: "DELETE",
			body: JSON.stringify(shareId),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then(() => mutateShareId(null))
			.catch((error: Error) => console.error(error.message));
	};

	return {
		shareId: error ? null : shareId,
		createShareId,
		deleteShareId,
		error: error?.message,
	};
};

export default useShareId;
