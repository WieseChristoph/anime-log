import { useSession } from "next-auth/react";
import Head from "next/head";
import Loading from "@/components/Util/Loading";
import Log from "@/components/Log/Log";
import Navbar from "@/components/Navbar/Navbar";
import LoginAlert from "@/components/Util/LoginAlert";

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
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {status !== "loading" ? (
                status === "authenticated" ? (
                    <Log />
                ) : (
                    <LoginAlert />
                )
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Home;
