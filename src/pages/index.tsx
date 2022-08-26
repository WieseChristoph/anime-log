import Loading from "@/components/Util/Loading";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Log from "../components/Log/Log";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
	const { status } = useSession();

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

			<Navbar />

			{status !== "loading" ? (
				status === "authenticated" ? (
					<Log />
				) : (
					<div className="p-5">
						<div
							className="flex p-4 mb-4 bg-blue-100 border-t-4 border-blue-500 dark:bg-blue-200"
							role="alert"
						>
							<svg
								className="flex-shrink-0 w-5 h-5 text-blue-700"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								></path>
							</svg>
							<div className="ml-3 text-sm font-medium text-blue-700">
								Log in to log your watched anime!
							</div>
						</div>
					</div>
				)
			) : (
				<Loading />
			)}
		</div>
	);
};

export default Home;
