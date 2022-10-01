import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import Log from "@/components/Log/Log";
import InfoAlert from "@/components/Util/InfoAlert";
import Loading from "@/components/Util/Loading";
import { useSession } from "next-auth/react";

function Home() {
    const router = useRouter();
    const { status } = useSession();
    const shareId = router.query.slug?.at(0);

    return (
        <>
            <Head>
                {shareId ? (
                    <title>Shared Log | Anime Log</title>
                ) : (
                    <title>Home | Anime Log</title>
                )}
                <meta
                    name="description"
                    content="Manage and share your watched Anime!"
                />
                <meta property="og:image" content="/torii-gate.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar urlShareId={shareId} />

            {status !== "loading" ? (
                status === "authenticated" ? (
                    <Log shareId={shareId} />
                ) : (
                    <InfoAlert message="Log in to log your watched anime!" />
                )
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Home;