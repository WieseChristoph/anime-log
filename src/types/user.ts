import { z } from 'zod';

export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export type UserRoleType = z.infer<typeof UserRoleSchema>;

export const UserRoleValues = UserRoleSchema.enum;
