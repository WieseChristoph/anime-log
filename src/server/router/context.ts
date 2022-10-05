// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import {
    Session,
    unstable_getServerSession as getServerSession,
} from "next-auth";
import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/server/db/prisma";

type CreateContextOptions = {
    session: Session | null;
    ipAddress: string | undefined;
};

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
        ipAddress: opts.ipAddress,
    };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    const ipAddress =
        opts.req.headers["x-forwarded-for"]?.toString() ||
        opts.req.socket.remoteAddress;
    const session = await getServerSession(
        opts.req,
        opts.res,
        getNextAuthOptions(ipAddress)
    );

    return await createContextInner({
        session,
        ipAddress,
    });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
