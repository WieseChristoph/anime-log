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
				<div className="px-1 py-1">
					{getSavedUsers.data ? (
						getSavedUsers.data.map((savedUserEntry) => (
							<Link
								href={`/${savedUserEntry.savedUser.shareId}`}
								passHref
								key={savedUserEntry.savedUser.shareId}
							>
								<Menu.Item>
									<a
										href={`/${savedUserEntry.savedUser.shareId}`}
										className={`flex px-2 py-2 text-sm hover:underline gap-2 ${
											urlShareId ===
												savedUserEntry.savedUser
													.shareId && "bg-slate-800"
										}`}
									>
										<Image
											className="rounded-full inline"
											src={
												savedUserEntry.savedUser
													.image ||
												"https://cdn.discordapp.com/embed/avatars/3.png"
											}
											alt={
												savedUserEntry.savedUser.name ||
												"-"
											}
											width="24"
											height="24"
										/>

										<span>
											{savedUserEntry.savedUser.name}
										</span>
									</a>
								</Menu.Item>
							</Link>
						))
					) : (
						<Menu.Item key="noSavedLogs">
							<span className="flex px-2 py-2 text-sm hover:underline">
								No saved logs
							</span>
						</Menu.Item>
					)}
				</div>
				{urlShareId && getSavedUsers.data && (
					<div className="px-1 py-1">
						<Menu.Item>
							{getSavedUsers.data.find(
								(savedUserEntry) =>
									savedUserEntry.savedUser.shareId ===
									urlShareId
							) ? (
								<button
									className="flex px-2 py-2 text-sm hover:underline"
									onClick={() =>
										deleteSavedUser.mutate({
											shareId: urlShareId,
										})
									}
								>
									Delete current log
								</button>
							) : (
								<button
									className="flex px-2 py-2 text-sm hover:underline"
									onClick={() =>
										addSavedUser.mutate({
											shareId: urlShareId,
										})
									}
								>
									Save current log
								</button>
							)}
						</Menu.Item>
					</div>
				)}
			</Menu.Items>
		</Menu>
	);
};

SavedUsersDropdown.propTypes = {
	urlShareId: PropTypes.string,
};

export default SavedUsersDropdown;
