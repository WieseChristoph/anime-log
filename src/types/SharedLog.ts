import z from "zod";

export const sharedLogValidator = z.object({
	userId: z.string().max(256),
	shareId: z.string().uuid(),
	savedBy: z.array(z.string()),
});

export type SharedLog = z.infer<typeof sharedLogValidator>;
