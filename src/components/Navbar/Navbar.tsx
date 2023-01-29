import { useSession } from "next-auth/react";
import { type DiscordProfile } from "next-auth/providers/discord";

import { FaToriiGate } from "react-icons/fa";
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
        <nav className="flex-wrap bg-gray-200 px-3 py-2.5 dark:bg-slate-900 sm:px-4">
            <div className="container mx-auto flex flex-wrap items-center">
                <Link
                    href="/"
                    className="order-first mr-auto flex items-center sm:mr-8"
                >
                    <FaToriiGate className="mr-3 text-2xl" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Anime Log
                    </span>
                </Link>

                <ul className="order-last flex flex-row sm:mr-auto sm:space-x-8 sm:text-sm sm:font-medium">
                    {/* Only for logged in users */}
                    {status === "authenticated" && (
                        <>
                            <li className="block py-2 pr-4 sm:p-0">
                                <SavedUsersDropdown urlShareId={urlShareId} />
                            </li>
                        </>
                    )}
                    {/* Only for logged in users or when a shareId is present */}
                    {(status === "authenticated" || urlShareId) && (
                        <>
                            <li className="block py-2 pr-4 pl-3 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white sm:p-0">
                                <Link href={`/stats/${urlShareId ?? ""}`}>
                                    Stats
                                </Link>
                            </li>
                        </>
                    )}
                    {/* Always visible */}
                    <li className="block py-2 pr-4 pl-3 sm:p-0">
                        <AboutDropdown />
                    </li>
                </ul>

                <div className="order-2 flex items-center sm:order-last">
                    <DarkModeToggle />

                    {status !== "loading" &&
                        (status === "authenticated" ? (
                            <ProfileDropdown
                                user={session.user as DiscordProfile}
                            />
                        ) : (
                            <LoginButton />
                        ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
