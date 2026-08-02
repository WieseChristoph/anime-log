import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/admin-layout';
import ErrorAlert from '@/components/util/error-alert';
import Navbar from '@/components/navbar/navbar';
import Head from 'next/head';
import { UserRoleValues } from '@/types/user';

const Admin: NextPage = () => {
    const { status, data: session } = useSession();

    return (
        <>
            <Head>
                <title>Admin Panel | Anime Log</title>
                <meta name="description" content="Manage and share your watched Anime!" />
                <meta property="og:image" content="/torii-gate.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {status === 'authenticated' && session.user.role === UserRoleValues.ADMIN ? (
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
