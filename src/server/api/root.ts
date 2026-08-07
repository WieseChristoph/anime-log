import { animeRouter } from '@/server/api/routers/anime';
import { savedUserRouter } from '@/server/api/routers/saved-user';
import { userRouter } from '@/server/api/routers/user';
import { createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
    anime: animeRouter,
    savedUser: savedUserRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
