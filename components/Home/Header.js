import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToriiGate } from "@fortawesome/free-solid-svg-icons";

const Header = ({ urlShareId }) => {
	const { user } = useUser();

	const { data: shareId, mutate: mutateShareId } = useSWR(
		"/api/sharedLog/getId"
	);
	const { data: savedSharedLogs, mutate: mutateSavedSharedLogs } = useSWR(
		"/api/savedSharedLogs"
	);

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
			.then((data) => mutateShareId(data))
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
			.then(() => mutateShareId(null))
			.catch((error) => console.error(error.message));
	};

	const addSavedSharedLog = () => {
		fetch("/api/savedSharedLogs", {
			method: "PUT",
			body: JSON.stringify({ shareId: urlShareId }),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => mutateSavedSharedLogs([...savedSharedLogs, data]))
			.catch((error) => console.error(error.message));
	};

	const deleteSavedSharedLog = () => {
		fetch("/api/savedSharedLogs", {
			method: "DELETE",
			body: JSON.stringify({ shareId: urlShareId }),
		})
			.then((res) => {
				if (!res.ok) throw new Error("HTTP status: " + res.status);
				return res.json();
			})
			.then((data) => {
				mutateSavedSharedLogs(
					savedSharedLogs.filter(
						(sharedLog) => sharedLog.shareId !== data.shareId
					)
				);
			})
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
					<ul className="navbar-nav col-12 col-lg-auto me-lg-auto justify-content-center ms-5">
						{user ? (
							// Saved Logs dropdown
							<li className="nav-item dropdown">
								<a
									className="nav-link text-light dropdown-toggle"
									href="#"
									id="savedLogsDropdown"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Saved Logs
								</a>
								<ul
									className="dropdown-menu dropdown-menu-dark"
									aria-labelledby="savedLogsDropdown"
								>
									{/* List of saved shared logs */}
									{savedSharedLogs &&
									savedSharedLogs.length > 0 ? (
										savedSharedLogs.map((sharedLog) => (
											<li key={sharedLog.shareId}>
												<Link
													href={
														"/" + sharedLog.shareId
													}
												>
													<a className="dropdown-item">
														{sharedLog.username}
													</a>
												</Link>
											</li>
										))
									) : (
										<li key="noSavedLogs">
											<span className="dropdown-item">
												{" "}
												No saved logs
											</span>
										</li>
									)}

									<li key="divider">
										<hr className="dropdown-divider" />
									</li>

									{/* Add or delete saved shared log buttons */}
									{urlShareId && savedSharedLogs ? (
										<li key="buttons">
											{savedSharedLogs.find(
												(sharedLog) =>
													sharedLog.shareId ===
													urlShareId
											) ? (
												<button
													className="dropdown-item"
													onClick={() =>
														deleteSavedSharedLog()
													}
												>
													Delete current log
												</button>
											) : (
												<button
													className="dropdown-item"
													onClick={() =>
														addSavedSharedLog()
													}
												>
													Save current log
												</button>
											)}
										</li>
									) : (
										""
									)}
								</ul>
							</li>
						) : (
							""
						)}
					</ul>

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
