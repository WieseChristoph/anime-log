import z from 'zod';
import { normalizeExternalUrl } from '@/utils/external-url';

export const AnimeStatusSchema = z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'PAUSED', 'DROPPED']);
export type AnimeStatusType = z.infer<typeof AnimeStatusSchema>;

export const AnimeStatusValues = AnimeStatusSchema.enum;

const ExternalUrlSchema = z.string().max(512).nullable().transform(normalizeExternalUrl);

export const AnimeSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    isManga: z.boolean().default(false),
    seasons: z.array(z.number()).default([]),
    movies: z.array(z.number()).default([]),
    ovas: z.array(z.number()).default([]),
    rating: z.number().min(0).max(11).default(5),
    favorite: z.boolean().default(false),
    status: z
        .string()
        .default(AnimeStatusValues.PLANNED)
        .refine((value) => AnimeStatusSchema.safeParse(value).success, 'Invalid anime status'),
    link: ExternalUrlSchema,
    note: z.string().nullable(),
    imageUrl: z.string().max(512).nullable(),
    hasCustomImage: z.boolean().default(false),
    startDate: z.date().nullable(),
    updatedAt: z.date(),
    createdAt: z.date(),
});
export type AnimeType = z.infer<typeof AnimeSchema>;

export type AnimeDraftType = Omit<AnimeType, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
