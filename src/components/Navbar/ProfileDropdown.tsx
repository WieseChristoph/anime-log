import { signOut } from "next-auth/react";
import Image from "next/image";
import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import { User } from "next-auth";
import { trpc } from "@/utils/trpc";

interface Props {
	user: User;
}

const ProfileDropdown = ({ user }: Props) => {
	const utils = trpc.useContext();

	const getShareId = trpc.useQuery(["user.get-shareId"]);

	const addShareId = trpc.useMutation(["user.add-shareId"], {
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["user.get-shareId"]);
		},
	});

	const deleteShareId = trpc.useMutation(["user.delete-shareId"], {
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["user.get-shareId"]);
		},
	});

	const shareLinkToClipboard = () => {
		// if shareId is set, put link with shareId in clipboard
		if (getShareId.data?.shareId)
			navigator.clipboard.writeText(
				window.location.origin + "/" + getShareId.data.shareId
			);
	};

	return (
		<Menu as="div" className="relative inline-block">
			<Menu.Button className="flex items-center">
				<Image
					className="rounded-full"
					src={
						user.image ||
						"https://cdn.discordapp.com/embed/avatars/3.png"
					}
					alt={user.name || "-"}
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
					{getShareId.data?.shareId ? (
						<>
							<Menu.Item>
								<button
									className="px-2 py-2 text-sm hover:underline"
									onClick={() =>
										window.confirm(
											"Are you sure you want to delete your Share-Link?"
										) && deleteShareId.mutate()
									}
								>
									Delete Share-Link
								</button>
							</Menu.Item>
							<Menu.Item>
								<button
									className="px-2 py-2 text-sm hover:underline"
									onClick={() => shareLinkToClipboard()}
								>
									Copy Share-Link
								</button>
							</Menu.Item>
						</>
					) : (
						<Menu.Item>
							<button
								className="px-2 py-2 text-sm hover:underline"
								onClick={() => addShareId.mutate()}
							>
								Create Share-Link
							</button>
						</Menu.Item>
					)}
				</div>
				<div className="px-1 py-1">
					<Menu.Item>
						<button
							className="px-2 hover:underline text-sm"
							onClick={() => signOut()}
						>
							Sign out
						</button>
					</Menu.Item>
				</div>
			</Menu.Items>
		</Menu>
	);
};

ProfileDropdown.propTypes = {
	user: PropTypes.object.isRequired,
};

export default ProfileDropdown;
