import { useSession } from "next-auth/react";
import Head from "next/head";
import Loading from "@/components/Util/Loading";
import Log from "@/components/Log/Log";
import Navbar from "@/components/Navbar/Navbar";
import InfoAlert from "@/components/Util/InfoAlert";

function Home() {
    const { status } = useSession();

    return (
        <div>
            <Head>
                <title>Home | Anime Log</title>
                <meta
                    name="description"
                    content="Manage and share your watched Anime!"
                />
                <meta property="og:image" content="/torii-gate.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {status !== "loading" ? (
                status === "authenticated" ? (
                    <Log />
                ) : (
                    <InfoAlert message="Log in to log your watched anime!" />
                )
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Home;
