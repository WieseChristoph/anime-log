import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar/Navbar";
import Log from "../components/Log/Log";

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

			<Navbar urlShareId={shareId} />

			<Log shareId={shareId} />
		</div>
	);
}

export default SharedLog;
