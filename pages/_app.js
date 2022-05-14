import { useEffect } from "react";
import { SWRConfig } from "swr";
import { UserProvider } from "@auth0/nextjs-auth0";
import { config } from "@fortawesome/fontawesome-svg-core";

import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "bootstrap/dist/css/bootstrap.css";

function AnimeLog({ Component, pageProps }) {
	useEffect(() => {
		import("bootstrap/dist/js/bootstrap");
	}, []);

	return (
		<UserProvider>
			<SWRConfig
				value={{
					fetcher: (resource, init) =>
						fetch(resource, init).then((res) => res.json()),
				}}
			>
				<Component {...pageProps} />
			</SWRConfig>
		</UserProvider>
	);
}

export default AnimeLog;
