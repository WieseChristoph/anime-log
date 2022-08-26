import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@/server/router";

import "../styles/globals.css";

const AnimeLog = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider attribute="class">
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
	);
};

function getBaseUrl() {
	if (typeof window !== "undefined") {
		return "";
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query-v3.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(AnimeLog);
