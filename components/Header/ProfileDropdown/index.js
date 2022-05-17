import useShareId from "./useShareId";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

const ProfileDropdown = ({ user }) => {
	const { shareId, createShareId, deleteShareId } = useShareId();

	const shareLinkToClipboard = () => {
		// if shareId is set, put link with shareId in clipboard
		if (shareId)
			navigator.clipboard.writeText(
				window.location.origin + "/" + shareId
			);
	};

	return (
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
								window.confirm("Delete Share-Link?")
									? deleteShareId()
									: null
							}
						>
							Delete Share-Link
						</button>
						<button
							className="dropdown-item"
							onClick={shareLinkToClipboard}
						>
							Copy Share-Link
						</button>
					</>
				) : (
					<button className="dropdown-item" onClick={createShareId}>
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
	);
};

ProfileDropdown.propTypes = {
	user: PropTypes.object.isRequired,
};

export default ProfileDropdown;
