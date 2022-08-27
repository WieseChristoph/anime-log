// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { animeRouter } from "./anime";
import { savedUserRouter } from "./savedUser";
import { userRouter } from "./user";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("anime.", animeRouter)
	.merge("savedUser.", savedUserRouter)
	.merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
