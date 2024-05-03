import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils/api";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

import "@/styles/globals.css";

const NEXT_PUBLIC_UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const NEXT_PUBLIC_UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const AnimeLog: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <>
            {NEXT_PUBLIC_UMAMI_SCRIPT_URL && NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
                <Script
                    src={NEXT_PUBLIC_UMAMI_SCRIPT_URL}
                    data-website-id={NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                    strategy="lazyOnload"
                />
            )}
            <SessionProvider session={session}>
                <ThemeProvider attribute="class">
                    <Component {...pageProps} />
                </ThemeProvider>
            </SessionProvider>
        </>
    );
};

export default api.withTRPC(AnimeLog);
