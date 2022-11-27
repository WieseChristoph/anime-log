import Navbar from "@/components/Navbar/Navbar";
import StatsLayout from "@/components/Stats/StatsLayout";
import InfoAlert from "@/components/Util/InfoAlert";
import Loading from "@/components/Util/Loading";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Snowfall from "react-snowfall";

function Stats() {
    const router = useRouter();
    const { status } = useSession();
    const shareId = router.query.slug?.at(0);

    return (
        <>
            <Head>
                <title>Stats | Anime Log</title>
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
                    <StatsLayout shareId={shareId} />
                ) : (
                    <InfoAlert message="Log in to see Statistics!" />
                )
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Stats;
