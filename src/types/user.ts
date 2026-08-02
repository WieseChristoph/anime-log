import { z } from 'zod';

export type UserRoleType = 'USER' | 'ADMIN';

export const UserRoleSchema = z.enum(['USER', 'ADMIN']);

export const UserRoleValues = {
    USER: 'USER' as const,
    ADMIN: 'ADMIN' as const,
};
