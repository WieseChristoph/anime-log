import { type GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { getAuthOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * Don't worry too much about the "unstable", it's safe to use but the syntax
 * may change in future versions
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    const ipAddress =
        ctx.req.headers["x-forwarded-for"]?.toString() ||
        ctx.req.socket.remoteAddress;

    return await unstable_getServerSession(
        ctx.req,
        ctx.res,
        getAuthOptions(ipAddress)
    );
};
