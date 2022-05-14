import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/Home/Header";
import Log from "../components/Home/Log";

function SharedLog() {
	const router = useRouter();
	const { shareId } = router.query;

	return (
		<div>
			<Head>
				<title>Shared Log | Anime Log</title>
				<meta
					name="description"
					content="Manage and share your watched Anime!"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<Log shareId={shareId} />
		</div>
	);
}

export default SharedLog;
