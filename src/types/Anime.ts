import z from "zod";

export const animeValidator = z.object({
	id: z.string(),
	title: z.string(),
	seasons: z.array(z.number()),
	movies: z.array(z.number()),
	ovas: z.array(z.number()),
	rating: z.number().min(0).max(11).default(0),
	link: z.string().max(512).url().nullable(),
	note: z.string().nullable(),
	imageUrl: z.string().max(512).url().nullable(),
	startDate: z.date().nullable(),
	updatedAt: z.date(),
});

export type Anime = z.infer<typeof animeValidator>;
