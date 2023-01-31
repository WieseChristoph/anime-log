import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

import AdminLayout from "@/components/Admin/AdminLayout";
import ErrorAlert from "@/components/Util/ErrorAlert";
import Navbar from "@/components/Navbar/Navbar";
import Head from "next/head";

const Admin: NextPage = () => {
    const { status, data: session } = useSession();

    return (
        <>
            <Head>
                <title>Admin Panel | Anime Log</title>
                <meta
                    name="description"
                    content="Manage and share your watched Anime!"
                />
                <meta property="og:image" content="/torii-gate.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {status === "authenticated" &&
            session.user.role === UserRole.ADMIN ? (
                <AdminLayout />
            ) : (
                <div className="p-5">
                    <ErrorAlert message="Must be admin to access this page." />
                </div>
            )}
        </>
    );
};

export default Admin;
