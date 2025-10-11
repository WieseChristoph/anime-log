import z from 'zod';

export enum Order {
    TITLE = 'title',
    START_DATE = 'startDate',
    RATING = 'rating',
    UPDATED_AT = 'updatedAt',
}

export const LogOptionsSchema = z.object({
    order: z.enum(Order),
    asc: z.boolean(),
    searchTerm: z.string(),
    filter: z.object({
        anime: z.boolean(),
        manga: z.boolean(),
    }),
});

export type LogOptions = z.infer<typeof LogOptionsSchema>;
