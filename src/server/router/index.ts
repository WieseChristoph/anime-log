// src/server/router/index.ts
import { Context, createRouter } from "./context";
import superjson from "superjson";

import { animeRouter } from "./subrouters/anime";
import { savedUserRouter } from "./subrouters/savedUser";
import { userRouter } from "./subrouters/user";
import { MiddlewareResult } from "@trpc/server/dist/declarations/src/internals/middlewares";
import { log } from "../utils/auditLog";

export const appRouter = createRouter()
    .transformer(superjson)
    .middleware(async ({ path, next, ctx }) => {
        const result: MiddlewareResult<Context> = await next();
        log(path, ctx.ipAddress, ctx.session?.user?.id, result.ok);
        return next(result);
    })
    .merge("anime.", animeRouter)
    .merge("savedUser.", savedUserRouter)
    .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
