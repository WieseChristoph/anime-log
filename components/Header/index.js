import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToriiGate } from "@fortawesome/free-solid-svg-icons";
import ProfileDropdown from "./ProfileDropdown";
import SavedLogsDropdown from "./SavedLogsDropdown";

const Header = ({ urlShareId }) => {
	const { user } = useUser();

	return (
		<header className="p-3 bg-dark text-white">
			<div className="container">
				<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
					{/* Website icon */}
					<Link href="/">
						<a>
							<FontAwesomeIcon
								icon={faToriiGate}
								className="bi me-4 fs-3 text-light"
							/>
						</a>
					</Link>
					<h4 className="my-auto">Anime Log</h4>

					{/* Navigation items */}
					<ul className="navbar-nav col-12 col-lg-auto me-lg-auto justify-content-center ms-5">
						{user && (
							// Saved Logs dropdown
							<SavedLogsDropdown urlShareId={urlShareId} />
						)}
					</ul>

					{/* Dropdown or login button */}
					{user ? (
						<ProfileDropdown user={user} />
					) : (
						<div className="text-end">
							<Link href="/api/auth/login?connection=discord">
								<a className="btn btn-outline-light me-2">
									Login
								</a>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
