import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { api } from "@/utils/api";

const AnimeLog: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class">
                <Component {...pageProps} />
            </ThemeProvider>
            <Analytics />
        </SessionProvider>
    );
};

export default api.withTRPC(AnimeLog);
