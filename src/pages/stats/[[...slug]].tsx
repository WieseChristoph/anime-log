import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type NextPage } from "next";

import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import StatsLayout from "@/components/Stats/StatsLayout";
import Loading from "@/components/Util/Loading";
import Snowfall from "react-snowfall";
import ErrorAlert from "@/components/Util/ErrorAlert";

const Stats: NextPage = () => {
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
                status === "authenticated" || shareId ? (
                    <StatsLayout shareId={shareId} />
                ) : (
                    <div className="p-5">
                        <ErrorAlert message="Must be logged in to access own statistics." />
                    </div>
                )
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Stats;
