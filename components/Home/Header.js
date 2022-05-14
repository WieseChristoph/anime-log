import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToriiGate } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
	const { user } = useUser();

	const { data: shareId, mutate } = useSWR("/api/sharedLog/getId");

	const shareLinkToClipboard = () => {
		// if shareId is set, put link with shareId in clipboard
		if (shareId)
			navigator.clipboard.writeText(
				window.location.origin + "/" + shareId
			);
	};

	const createShareId = () => {
		fetch("/api/sharedLog", { method: "PUT" })
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutate(data))
			.catch((error) => console.error(error.message));
	};

	const deleteShareId = () => {
		fetch("/api/sharedLog", {
			method: "DELETE",
			body: JSON.stringify(shareId),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then(() => mutate(null))
			.catch((error) => console.error(error.message));
	};

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
					<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"></ul>

					{/* Dropdown or login button */}
					{user ? (
						<div className="dropdown text-end">
							<button
								className="dropdown-toggle text-light bg-transparent border-0"
								id="dropdownUser"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<Image
									src={user.picture}
									alt={user.name}
									width="32"
									height="32"
									className="rounded-circle border border-2 border-light"
								/>
							</button>
							<ul
								className="dropdown-menu text-small"
								aria-labelledby="dropdownUser"
							>
								{shareId ? (
									<>
										<button
											className="dropdown-item"
											onClick={() =>
												window.confirm(
													"Delete Share-Link?"
												)
													? deleteShareId()
													: ""
											}
										>
											Delete Share-Link
										</button>
										<button
											className="dropdown-item"
											onClick={() =>
												shareLinkToClipboard()
											}
										>
											Copy Share-Link
										</button>
									</>
								) : (
									<button
										className="dropdown-item"
										onClick={() => createShareId()}
									>
										Create Share-Link
									</button>
								)}
								<li>
									<hr className="dropdown-divider" />
								</li>
								<Link href="/api/auth/logout">
									<a className="dropdown-item">Sign out</a>
								</Link>
							</ul>
						</div>
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
