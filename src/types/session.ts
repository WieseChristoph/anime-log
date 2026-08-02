import type { UserRoleType } from '@/types/user';

export type AppUserType = {
    id: string;
    role: UserRoleType;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export type AppSessionType = {
    expires: string;
    user: AppUserType;
};
