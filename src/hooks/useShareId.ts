import useSWR, { KeyedMutator } from "swr";
import ApiResponse from "../types/ApiResponse";

interface ReturnTypes {
	shareId: string;
	createShareId: () => void;
	deleteShareId: () => void;
	error: string;
}

function useShareId(): ReturnTypes {
	const { data: shareId, mutate, error } = useSWR<string>("/api/log/shared");

	if (error) console.error(error);

	function createShareId(): void {
		fetch("/api/log/shared", { method: "PUT" })
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				mutate(body.data);
			})
			.catch((error: Error) => console.error(error.message));
	}

	function deleteShareId(): void {
		fetch("/api/log/shared", {
			method: "DELETE",
			body: JSON.stringify({ shareId: shareId }),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);
			})
			.catch((error: Error) => console.error(error.message));
	}

	return {
		shareId: error ? null : shareId,
		createShareId,
		deleteShareId,
		error: error?.message,
	};
}

export default useShareId;
