import { SWRConfig } from "swr";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";

import "../styles/globals.css";

const swrFetcher = async (resource, init) => {
	const res = await fetch(resource, init);
	if (!res.ok) {
		const error = new Error(await res.json());
		throw error;
	}

	return res.json();
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
