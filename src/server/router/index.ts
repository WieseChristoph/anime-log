// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { animeRouter } from "./anime";
import { savedUserRouter } from "./savedUser";
import { userRouter } from "./user";
import { kitsuRouter } from "./kitsu";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("anime.", animeRouter)
    .merge("savedUser.", savedUserRouter)
    .merge("user.", userRouter)
    .merge("kitsu.", kitsuRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
