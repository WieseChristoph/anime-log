import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import Log from "@/components/Log/Log";
import InfoAlert from "@/components/Util/InfoAlert";
import Loading from "@/components/Util/Loading";
import { useSession } from "next-auth/react";

function SharedLog() {
    const router = useRouter();
    const { status } = useSession();
    const shareId = router.query.shareId as string;

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

            {status !== "loading" ? (
                status === "authenticated" ? (
                    <Log shareId={shareId} />
                ) : (
                    <InfoAlert message="Log in to log your watched anime!" />
                )
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default SharedLog;
