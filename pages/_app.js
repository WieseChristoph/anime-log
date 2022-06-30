import { SWRConfig } from "swr";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

function AnimeLog({ Component, pageProps }) {
	return (
		<UserProvider>
			<SWRConfig
				value={{
					fetcher: (resource, init) =>
						fetch(resource, init).then((res) => res.json()),
				}}
			>
				<ThemeProvider attribute="class">
					<Component {...pageProps} />
				</ThemeProvider>
			</SWRConfig>
		</UserProvider>
	);
}

export default AnimeLog;
