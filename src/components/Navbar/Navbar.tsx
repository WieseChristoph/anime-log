import { useSession } from "next-auth/react";
import { user_role } from "@prisma/client";

import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import LoginButton from "./LoginButton";
import SavedUsersDropdown from "./SavedUsersDropdown";
import DarkModeToggle from "./DarkModeToggle";
import AboutDropdown from "./AboutDropdown";

interface Props {
    urlShareId?: string;
}

const Navbar: React.FC<Props> = ({ urlShareId }) => {
    const { data: session, status } = useSession();

    return (
        <nav className="sticky top-0 z-40 flex-wrap bg-white px-3 py-2.5 shadow-lg dark:bg-slate-900 sm:px-4">
            <div className="container mx-auto flex flex-wrap items-center">
                <Link
                    href="/"
                    className="order-first mr-auto flex items-center sm:mr-8"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="mr-3 h-7 w-7 dark:fill-white"
                    >
                        <path d="M376.5 32h-240.9A303.2 303.2 0 0 1 0 0v96c0 17.7 14.3 32 32 32h32v64H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v240c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V256h256v240c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V256h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-48v-64h32c17.7 0 32-14.3 32-32V0a303.2 303.2 0 0 1 -135.6 32zM128 128h96v64h-96v-64zm256 64h-96v-64h96v64z" />
                    </svg>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Anime Log
                    </span>
                </Link>

                <ul className="order-last flex flex-row items-center sm:mr-auto sm:space-x-8 sm:text-sm sm:font-medium">
                    {/* Only for logged in users */}
                    {status === "authenticated" && (
                        <li className="block py-2 pr-4 sm:p-0">
                            <SavedUsersDropdown urlShareId={urlShareId} />
                        </li>
                    )}
                    {/* Only for logged in users or when a shareId is present */}
                    {(status === "authenticated" || urlShareId) && (
                        <li className="block py-2 pl-3 pr-4 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white sm:p-0">
                            <Link href={`/stats/${urlShareId ?? ""}`}>
                                Stats
                            </Link>
                        </li>
                    )}
                    {/* Always visible */}
                    <li className="block py-2 pl-3 pr-4 sm:p-0">
                        <AboutDropdown />
                    </li>
                    {/* Visible to admins */}
                    {status === "authenticated" &&
                        session.user.role === user_role.ADMIN && (
                            <li className="block py-2 pl-3 pr-4 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white sm:p-0">
                                <Link href="/admin">Admin Panel</Link>
                            </li>
                        )}
                </ul>

                <div className="order-2 flex items-center sm:order-last">
                    <DarkModeToggle />

                    {status !== "loading" &&
                        (status === "authenticated" ? (
                            <ProfileDropdown user={session.user} />
                        ) : (
                            <LoginButton />
                        ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
