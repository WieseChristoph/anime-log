import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaToriiGate } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import LoginButton from "./LoginButton";
import SavedUsersDropdown from "./SavedUsersDropdown";
import DarkModeToggle from "./DarkModeToggle";
import { DiscordProfile } from "next-auth/providers/discord";

interface Props {
	urlShareId?: string;
}

const Navbar = ({ urlShareId }: Props) => {
	const { data: session, status } = useSession();

	return (
		<nav className="bg-slate-200 dark:bg-slate-900 px-2 sm:px-4 py-2.5">
			<div className="container flex flex-wrap items-center mx-auto">
				<Link href="/">
					<a className="flex items-center mr-8">
						<FaToriiGate className="mr-3 text-2xl" />
						<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
							Anime Log
						</span>
					</a>
				</Link>

				<ul className="mr-auto">
					{status === "authenticated" && (
						<SavedUsersDropdown urlShareId={urlShareId} />
					)}
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
