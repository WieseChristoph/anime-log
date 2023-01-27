import { useSession } from "next-auth/react";
import { DiscordProfile } from "next-auth/providers/discord";

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
        <nav className="bg-gray-200 px-2 py-2.5 dark:bg-slate-900 sm:px-4">
            <div className="container mx-auto flex flex-wrap items-center">
                <Link href="/" className="mr-8 flex items-center">
                    <FaToriiGate className="mr-3 text-2xl" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Anime Log
                    </span>
                </Link>

                <ul className="mr-auto flex flex-col md:flex-row md:space-x-8 md:text-sm md:font-medium">
                    {/* Only for logged in users */}
                    {status === "authenticated" && (
                        <>
                            <li className="block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-300 md:p-0">
                                <SavedUsersDropdown urlShareId={urlShareId} />
                            </li>
                        </>
                    )}
                    {/* Only for logged in users or when a shareId is present */}
                    {(status === "authenticated" || urlShareId) && (
                        <>
                            <li className="block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-300 md:p-0">
                                <Link href={`/stats/${urlShareId ?? ""}`}>
                                    Stats
                                </Link>
                            </li>
                        </>
                    )}
                    {/* Always visible */}
                    <li className="block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-300 md:p-0">
                        <AboutDropdown />
                    </li>
                </ul>

                <div className="flex items-center">
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
