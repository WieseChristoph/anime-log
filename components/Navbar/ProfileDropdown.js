import useShareId from "../../hooks/useShareId";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";

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
		<Menu as="div" className="relative inline-block">
			<Menu.Button className="flex items-center">
				<Image
					className="rounded-full"
					src={user.picture}
					alt={user.name}
					width="32"
					height="32"
				/>
			</Menu.Button>
			{/* Dropdown menu */}
			<Menu.Items
				className="absolute right-0 mt-2 w-40 origin-top-right z-50
			divide-y divide-black dark:divide-white rounded-md text-dark dark:text-white
			bg-white dark:bg-slate-700 shadow-lg"
			>
				<div className="px-1 py-1">
					{shareId ? (
						<>
							<Menu.Item>
								<button
									className="px-2 py-2 text-sm hover:underline"
									onClick={() =>
										window.confirm(
											"Are you sure you want to delete your Share-Link?"
										) && deleteShareId()
									}
								>
									Delete Share-Link
								</button>
							</Menu.Item>
							<Menu.Item>
								<button
									className="px-2 py-2 text-sm hover:underline"
									onClick={shareLinkToClipboard}
								>
									Copy Share-Link
								</button>
							</Menu.Item>
						</>
					) : (
						<Menu.Item>
							<button
								className="px-2 py-2 text-sm hover:underline"
								onClick={createShareId}
							>
								Create Share-Link
							</button>
						</Menu.Item>
					)}
				</div>
				<div className="px-1 py-1">
					<Link href="/api/auth/logout" passHref>
						<Menu.Item className="py-3 px-4">
							<a className="flex px-2 py-2 text-sm hover:underline">
								Sign out
							</a>
						</Menu.Item>
					</Link>
				</div>
			</Menu.Items>
		</Menu>
	);
};

ProfileDropdown.propTypes = {
	user: PropTypes.object.isRequired,
};

export default ProfileDropdown;
