import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { FaToriiGate } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import LoginButton from "./LoginButton";
import SavedLogsDropdown from "./SavedLogsDropdown";
import DarkModeToggle from "./DarkModeToggle";

interface Props {
	urlShareId?: string;
}

const Navbar = ({ urlShareId }: Props) => {
	const { user } = useUser();

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
					<SavedLogsDropdown urlShareId={urlShareId} />
				</ul>

				<div className="flex items-center">
					<DarkModeToggle />

					{user ? <ProfileDropdown user={user} /> : <LoginButton />}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
