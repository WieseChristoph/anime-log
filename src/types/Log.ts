import Anime from "./Anime";

export default interface Log {
	_id: string;
	shareId?: string;
	anime?: Anime[];
	savedSharedLogs?: string[];
}
