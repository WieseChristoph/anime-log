import useSWR from "swr";
import ApiResponse from "../types/ApiResponse";
import SavedSharedLog from "../types/SavedSharedLog";

interface ReturnTypes {
	savedSharedLogs: SavedSharedLog[];
	addSavedSharedLog: (savedSharedLogId: string) => void;
	deleteSavedSharedLog: (savedSharedLogId: string) => void;
	error: string;
}

function useSavedSharedLog(): ReturnTypes {
	const {
		data: savedSharedLogs,
		mutate: mutate,
		error,
	} = useSWR<SavedSharedLog[]>("/api/log/shared/saved");

	if (error) console.error(error);

	function addSavedSharedLog(savedSharedLogId: string): void {
		fetch("/api/log/shared/saved", {
			method: "PUT",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				mutate([...savedSharedLogs, body.data as SavedSharedLog]);
			})
			.catch((error: Error) => console.error(error.message));
	}

	function deleteSavedSharedLog(savedSharedLogId: string): void {
		fetch("/api/log/shared/saved", {
			method: "DELETE",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then(async (res: Response) => {
				const body = (await res.json()) as ApiResponse;
				if (!res.ok || !body.success) throw new Error(body.message);

				mutate(
					savedSharedLogs.filter(
						(sharedLog) =>
							sharedLog.shareId !==
							(body.data as SavedSharedLog).shareId
					)
				);
			})
			.catch((error: Error) => console.error(error.message));
	}

	return {
		savedSharedLogs: error ? null : savedSharedLogs,
		addSavedSharedLog,
		deleteSavedSharedLog,
		error: error?.message,
	};
}

export default useSavedSharedLog;
