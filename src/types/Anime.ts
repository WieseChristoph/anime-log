import z from "zod";

export const animeValidator = z.object({
    id: z.string(),
    title: z.string().min(1),
    isManga: z.boolean().default(false),
    seasons: z.array(z.number()).default([]),
    movies: z.array(z.number()).default([]),
    ovas: z.array(z.number()).default([]),
    rating: z.number().min(0).max(11).default(5),
    link: z.string().max(512).nullable(),
    note: z.string().nullable(),
    imageUrl: z.string().max(512).nullable(),
    hasCustomImage: z.boolean().default(false),
    startDate: z.date().nullable(),
    updatedAt: z.date(),
    createdAt: z.date(),
});

export type Anime = z.infer<typeof animeValidator>;
