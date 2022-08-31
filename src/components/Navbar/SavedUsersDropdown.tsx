import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { trpc } from "@/utils/trpc";

interface Props {
    urlShareId?: string;
}

function SavedUsersDropdown({ urlShareId }: Props) {
    const ctx = trpc.useContext();

    const getSavedUsers = trpc.useQuery(["savedUser.get-all"]);

    const addSavedUser = trpc.useMutation(["savedUser.add"], {
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["savedUser.get-all"]);
        },
    });

    const deleteSavedUser = trpc.useMutation(["savedUser.delete"], {
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["savedUser.get-all"]);
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
                className="absolute z-50 mt-2
			w-52 divide-y divide-black rounded-md bg-gray-100 shadow-lg
			dark:divide-white dark:bg-slate-700 dark:text-white"
            >
                {getSavedUsers.data && getSavedUsers.data.length > 0 ? (
                    getSavedUsers.data.map((savedUserEntry) => (
                        <Menu.Item key={savedUserEntry.savedUser.shareId}>
                            <Link
                                href={`/${savedUserEntry.savedUser.shareId}`}
                                legacyBehavior={false}
                                className={`flex gap-2 px-2 py-2 text-sm hover:underline ${
                                    urlShareId ===
                                        savedUserEntry.savedUser.shareId &&
                                    "bg-gray-300 dark:bg-slate-800"
                                }`}
                            >
                                <Image
                                    className="inline rounded-full"
                                    src={
                                        savedUserEntry.savedUser.image ||
                                        "https://cdn.discordapp.com/embed/avatars/3.png"
                                    }
                                    alt={savedUserEntry.savedUser.name || "-"}
                                    width="24"
                                    height="24"
                                />
                                <b>{savedUserEntry.savedUser.name}</b>
                            </Link>
                        </Menu.Item>
                    ))
                ) : (
                    <Menu.Item
                        key="noSavedLogs"
                        as="div"
                        className="px-2 py-2 text-center text-sm hover:underline"
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
                            className="w-full px-2 py-2 text-sm text-red-600 hover:underline"
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
                            className="w-full px-2 py-2 text-sm text-blue-600 hover:underline"
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
}

SavedUsersDropdown.propTypes = {
    urlShareId: PropTypes.string,
};

export default SavedUsersDropdown;
