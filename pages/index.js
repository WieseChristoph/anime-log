import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Header from "../components/Header";
import Log from "../components/Log";

function Home() {
	const { user } = useUser();

	return (
		<div>
			<Head>
				<title>Home | Anime Log</title>
				<meta
					name="description"
					content="Manage and share your watched Anime!"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			{user ? (
				<Log />
			) : (
				<div className="position-absolute top-50 start-50 translate-middle">
					<h1 className="border border-light text-white p-3">
						Login to track your Anime!
					</h1>
				</div>
			)}
		</div>
	);
}

export default Home;
