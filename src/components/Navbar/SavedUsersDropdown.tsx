import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { trpc } from "@/utils/trpc";

interface Props {
	urlShareId?: string;
}

const SavedUsersDropdown = ({ urlShareId }: Props) => {
	const utils = trpc.useContext();

	const getSavedUsers = trpc.useQuery(["savedUser.get-all"]);

	const addSavedUser = trpc.useMutation(["savedUser.add"], {
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["savedUser.get-all"]);
		},
	});

	const deleteSavedUser = trpc.useMutation(["savedUser.delete"], {
		// Always refetch after error or success:
		onSettled: () => {
			utils.invalidateQueries(["savedUser.get-all"]);
		},
	});

	return (
		<Menu as="div" className="relative inline-block text-left">
			<Menu.Button className="flex items-center">
				Saved Logs
				<FaChevronDown className="ml-1 text-sm" />
			</Menu.Button>

			{/* Dropdown menu */}
			<Menu.Items
				className="absolute mt-2 w-52 z-50
			divide-y divide-black dark:divide-white rounded-md text-dark dark:text-white
			bg-white dark:bg-slate-700 shadow-lg"
			>
				{getSavedUsers.data && getSavedUsers.data.length > 0 ? (
					getSavedUsers.data.map((savedUserEntry) => (
						<Menu.Item key={savedUserEntry.savedUser.shareId}>
							<Link
								href={`/${savedUserEntry.savedUser.shareId}`}
								passHref
							>
								<a
									href={`/${savedUserEntry.savedUser.shareId}`}
									className={`flex px-2 py-2 text-sm hover:underline gap-2 border-black dark:border-white ${
										urlShareId ===
											savedUserEntry.savedUser.shareId &&
										"bg-gray-300 dark:bg-slate-800"
									}`}
								>
									<Image
										className="rounded-full inline"
										src={
											savedUserEntry.savedUser.image ||
											"https://cdn.discordapp.com/embed/avatars/3.png"
										}
										alt={
											savedUserEntry.savedUser.name || "-"
										}
										width="24"
										height="24"
									/>
									<b>{savedUserEntry.savedUser.name}</b>
								</a>
							</Link>
						</Menu.Item>
					))
				) : (
					<Menu.Item
						key="noSavedLogs"
						as="div"
						className="px-2 py-2 text-sm text-center hover:underline"
					>
						No saved logs
					</Menu.Item>
				)}
				{urlShareId &&
					getSavedUsers.data &&
					(getSavedUsers.data.find(
						(savedUserEntry) =>
							savedUserEntry.savedUser.shareId === urlShareId
					) ? (
						<Menu.Item
							as="button"
							className="w-full px-2 py-2 text-sm hover:underline"
							onClick={() =>
								deleteSavedUser.mutate({
									shareId: urlShareId,
								})
							}
						>
							Delete current log
						</Menu.Item>
					) : (
						<Menu.Item
							as="button"
							className="w-full px-2 py-2 text-sm hover:underline"
							onClick={() =>
								addSavedUser.mutate({
									shareId: urlShareId,
								})
							}
						>
							Save current log
						</Menu.Item>
					))}
			</Menu.Items>
		</Menu>
	);
};

SavedUsersDropdown.propTypes = {
	urlShareId: PropTypes.string,
};

export default SavedUsersDropdown;
