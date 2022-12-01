import z from "zod";

export enum Order {
    TITLE = "title",
    START_DATE = "startDate",
    RATING = "rating",
    UPDATED_AT = "updatedAt",
}

export const logOptionsValidator = z
    .object({
        order: z.nativeEnum(Order).default(Order.TITLE),
        asc: z.boolean().default(true),
        searchTerm: z.string().default(""),
        filter: z
            .object({
                anime: z.boolean().default(true),
                manga: z.boolean().default(true),
            })
            .default({}),
    })
    .default({});

export type LogOptions = z.infer<typeof logOptionsValidator>;
