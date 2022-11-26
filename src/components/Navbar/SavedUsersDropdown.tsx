import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { trpc } from "@/utils/trpc";
import DeleteButton from "../Util/DeleteButton";
import ImageWithFallback from "../Util/ImageWithFallback";

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
        <Menu as="div" className="relative z-50 inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center">
                        Saved Logs
                        <FaChevronDown className="ml-1 text-sm" />
                    </Menu.Button>

                    {/* Dropdown menu */}
                    <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-50 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-100 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-50 opacity-0"
                    >
                        <Menu.Items
                            className="absolute mt-2
			w-52 divide-y divide-black rounded-md bg-gray-100 shadow-lg
			dark:divide-white dark:bg-slate-700 dark:text-white"
                        >
                            {getSavedUsers.data &&
                            getSavedUsers.data.length > 0 ? (
                                getSavedUsers.data.map((savedUserEntry) => (
                                    <Menu.Item
                                        key={savedUserEntry.savedUser.shareId}
                                    >
                                        <Link
                                            href={`/${savedUserEntry.savedUser.shareId}`}
                                            legacyBehavior={false}
                                            className={`flex gap-2 px-2 py-2 text-sm hover:underline ${
                                                urlShareId ===
                                                    savedUserEntry.savedUser
                                                        .shareId &&
                                                "bg-gray-300 dark:bg-slate-800"
                                            }`}
                                        >
                                            <ImageWithFallback
                                                className="inline rounded-full"
                                                src={
                                                    savedUserEntry.savedUser
                                                        .image ||
                                                    "https://cdn.discordapp.com/embed/avatars/1.png"
                                                }
                                                fallbackSrc="https://cdn.discordapp.com/embed/avatars/1.png"
                                                alt={
                                                    savedUserEntry.savedUser
                                                        .name || "-"
                                                }
                                                width={24}
                                                height={24}
                                            />
                                            <b>
                                                {savedUserEntry.savedUser.name}
                                            </b>
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
                                        savedUserEntry.savedUser.shareId ===
                                        urlShareId
                                ) ? (
                                    <Menu.Item>
                                        <DeleteButton
                                            className="w-full px-2 py-2 text-sm text-red-600 hover:underline"
                                            title="Delete current Saved-Log?"
                                            text="You can always save this log again."
                                            successTitle="Deleted!"
                                            successText="Current Saved-Log has been deleted."
                                            onDeleteClick={() =>
                                                deleteSavedUser.mutate({
                                                    shareId: urlShareId,
                                                })
                                            }
                                        >
                                            Delete current log
                                        </DeleteButton>
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
                    </Transition>
                </>
            )}
        </Menu>
    );
}

SavedUsersDropdown.propTypes = {
    urlShareId: PropTypes.string,
};

export default SavedUsersDropdown;
