// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { animeRouter } from "./subrouters/anime";
import { savedUserRouter } from "./subrouters/savedUser";
import { userRouter } from "./subrouters/user";
import { kitsuRouter } from "./subrouters/kitsu";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("anime.", animeRouter)
    .merge("savedUser.", savedUserRouter)
    .merge("user.", userRouter)
    .merge("kitsu.", kitsuRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
