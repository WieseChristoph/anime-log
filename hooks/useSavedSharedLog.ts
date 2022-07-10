import useSWR from "swr";

type SavedSharedLog = {
	shareId: string;
	username: string;
};

interface ReturnTypes {
	savedSharedLogs: SavedSharedLog[];
	addSavedSharedLog: (savedSharedLogId: string) => void;
	deleteSavedSharedLog: (savedSharedLogId: string) => void;
	error: string;
}

const useSavedSharedLog = (): ReturnTypes => {
	const {
		data: savedSharedLogs,
		mutate: mutateSavedSharedLogs,
		error,
	} = useSWR("/api/savedSharedLogs");

	if (error) 
		console.error(error)

	const addSavedSharedLog = (savedSharedLogId: string) => {
		fetch("/api/savedSharedLogs", {
			method: "PUT",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((addedSavedSharedLog: SavedSharedLog) =>
				mutateSavedSharedLogs([...savedSharedLogs, addedSavedSharedLog])
			)
			.catch((error: Error) => console.error(error.message));
	};

	const deleteSavedSharedLog = (savedSharedLogId: string) => {
		fetch("/api/savedSharedLogs", {
			method: "DELETE",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then((res: Response) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((deletedSavedSharedLog: SavedSharedLog) => {
				mutateSavedSharedLogs(
					savedSharedLogs.filter(
						(sharedLog) =>
							sharedLog.shareId !== deletedSavedSharedLog.shareId
					)
				);
			})
			.catch((error: Error) => console.error(error.message));
	};

	return {
		savedSharedLogs: error ? null : (savedSharedLogs as SavedSharedLog[]),
		addSavedSharedLog,
		deleteSavedSharedLog,
		error: error?.message,
	};
};

export default useSavedSharedLog;
