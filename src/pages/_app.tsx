import { SWRConfig } from "swr";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";

import "../styles/globals.css";
import ApiResponse from "../types/ApiResponse";

const swrFetcher = async (resource, init) => {
	const res = await fetch(resource, init);
	const body = (await res.json()) as ApiResponse;
	if (!res.ok || !body.success) {
		throw new Error(body.message);
	}

	return body.data;
};

const AnimeLog = ({ Component, pageProps }: AppProps) => {
	return (
		<UserProvider>
			<SWRConfig
				value={{
					fetcher: swrFetcher,
				}}
			>
				<ThemeProvider attribute="class">
					<Component {...pageProps} />
				</ThemeProvider>
			</SWRConfig>
		</UserProvider>
	);
};

export default AnimeLog;
