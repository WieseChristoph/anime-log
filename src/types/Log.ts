import Anime from "./Anime";
import SavedSharedLog from "./SavedSharedLog";

export default interface Log {
	_id: string;
	shareId?: string;
	anime?: Anime[];
	savedSharedLogs?: SavedSharedLog[];
}
