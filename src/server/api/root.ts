import { createTRPCRouter } from '@/server/api/trpc';
import { animeRouter } from '@/server/api/routers/anime';
import { savedUserRouter } from '@/server/api/routers/saved-user';
import { userRouter } from '@/server/api/routers/user';

export const appRouter = createTRPCRouter({
    anime: animeRouter,
    savedUser: savedUserRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
