import z from 'zod';
import { AnimeStatusSchema } from '@/types/anime';

export const OrderValues = {
    TITLE: 'title',
    START_DATE: 'startDate',
    RATING: 'rating',
    UPDATED_AT: 'updatedAt',
} as const;
export type OrderType = (typeof OrderValues)[keyof typeof OrderValues];

export const LogOptionsSchema = z.object({
    order: z.union([z.literal('title'), z.literal('startDate'), z.literal('rating'), z.literal('updatedAt')]),
    asc: z.boolean(),
    searchTerm: z.string(),
    filter: z.object({
        anime: z.boolean(),
        manga: z.boolean(),
        favorites: z.boolean().default(false),
        statuses: z.array(AnimeStatusSchema).default([]),
    }),
});
export type LogOptionsType = z.infer<typeof LogOptionsSchema>;
