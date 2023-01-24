import { useRouter } from "next/router";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import Log from "@/components/Log/Log";
import InfoAlert from "@/components/Util/InfoAlert";
import Loading from "@/components/Util/Loading";
import Snowfall from "react-snowfall";

const Home: NextPage = () => {
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

            {/* Snow in december */}
            {new Date().getMonth() === 11 && (
                <Snowfall
                    style={{
                        zIndex: 100,
                    }}
                />
            )}

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
};

export default Home;
