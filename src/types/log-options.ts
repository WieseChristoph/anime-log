import z from 'zod';

export const OrderValues = {
    TITLE: 'title' as const,
    START_DATE: 'startDate' as const,
    RATING: 'rating' as const,
    UPDATED_AT: 'updatedAt' as const,
};

export type OrderType = (typeof OrderValues)[keyof typeof OrderValues];

export const LogOptionsSchema = z.object({
    order: z.union([z.literal('title'), z.literal('startDate'), z.literal('rating'), z.literal('updatedAt')]),
    asc: z.boolean(),
    searchTerm: z.string(),
    filter: z.object({
        anime: z.boolean(),
        manga: z.boolean(),
    }),
});

export type LogOptionsType = z.infer<typeof LogOptionsSchema>;
