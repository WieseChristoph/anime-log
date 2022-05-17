import useSWR from "swr";

const useSavedSharedLog = () => {
	const { data: savedSharedLogs, mutate: mutateSavedSharedLogs } = useSWR(
		"/api/savedSharedLogs"
	);

	const addSavedSharedLog = (savedSharedLogId) => {
		fetch("/api/savedSharedLogs", {
			method: "PUT",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutateSavedSharedLogs([...savedSharedLogs, data]))
			.catch((error) => console.error(error.message));
	};

	const deleteSavedSharedLog = (savedSharedLogId) => {
		fetch("/api/savedSharedLogs", {
			method: "DELETE",
			body: JSON.stringify({ shareId: savedSharedLogId }),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => {
				mutateSavedSharedLogs(
					savedSharedLogs.filter(
						(sharedLog) => sharedLog.shareId !== data.shareId
					)
				);
			})
			.catch((error) => console.error(error.message));
	};

	return { savedSharedLogs, addSavedSharedLog, deleteSavedSharedLog };
};

export default useSavedSharedLog;
