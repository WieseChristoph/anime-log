import { createTRPCRouter } from '@/server/api/trpc';
import { animeRouter } from '@/server/api/routers/anime';
import { savedUserRouter } from '@/server/api/routers/saved-user';
import { userRouter } from '@/server/api/routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    anime: animeRouter,
    savedUser: savedUserRouter,
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
