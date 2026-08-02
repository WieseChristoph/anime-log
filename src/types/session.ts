import type { UserRoleType } from '@/types/user';

export type AppUser = {
    id: string;
    role: UserRoleType;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export type AppSession = {
    expires: string;
    user: AppUser;
};
