import { createTRPCRouter } from "./trpc";
import { animeRouter } from "./routers/anime";
import { savedUserRouter } from "./routers/savedUser";
import { userRouter } from "./routers/user";

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
