import { Schema, model, models } from "mongoose";
import Log from "../types/Log";
import Anime from "../types/Anime";
import SavedSharedLog from "../types/SavedSharedLog";

const AnimeSchema = new Schema<Anime>({
	title: {
		type: String,
		required: true,
	},
	imageUrl: String,
	link: String,
	rating: {
		type: Number,
		required: true,
		min: 0,
		max: 11,
		default: 0,
	},
	startDate: Date,
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
	seasons: [Number],
	movies: [Number],
	ovas: [Number],
	note: String,
});

const LogSchema = new Schema<Log>({
	_id: String,
	shareId: String,
	anime: [AnimeSchema],
	savedSharedLogs: [String],
});

const LogModel = models.Log || model<Log>("Log", LogSchema);

export default LogModel;
