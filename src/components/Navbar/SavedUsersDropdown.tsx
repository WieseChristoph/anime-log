import { api } from "@/utils/api";

import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { MdDelete, MdSave } from "react-icons/md";
import DeleteButton from "../Util/DeleteButton";
import ImageWithFallback from "../Util/ImageWithFallback";

interface Props {
    urlShareId?: string;
}

const SavedUsersDropdown: React.FC<Props> = ({ urlShareId }) => {
    const ctx = api.useContext();

    const getSavedUsers = api.savedUser.getAll.useQuery();

    const addSavedUser = api.savedUser.add.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.savedUser.getAll.invalidate();
        },
    });

    const deleteSavedUser = api.savedUser.delete.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.savedUser.getAll.invalidate();
        },
    });

    return (
        <Menu as="div" className="relative z-20 inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center text-gray-700 hover:text-black  dark:text-gray-300 dark:hover:text-white">
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
                                            href={`/${
                                                savedUserEntry.savedUser
                                                    .shareId || ""
                                            }`}
                                            legacyBehavior={false}
                                            className={`flex gap-2 px-2 py-2 text-sm hover:underline ${
                                                urlShareId ===
                                                savedUserEntry.savedUser.shareId
                                                    ? "bg-gray-300 dark:bg-slate-800"
                                                    : ""
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
                                            className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
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
                                            <MdDelete className="text-xl" />
                                            <b>Delete current log</b>
                                        </DeleteButton>
                                    </Menu.Item>
                                ) : (
                                    <Menu.Item
                                        as="button"
                                        className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                        onClick={() =>
                                            addSavedUser.mutate({
                                                shareId: urlShareId,
                                            })
                                        }
                                    >
                                        <MdSave className="text-xl" />
                                        <b>Save current log</b>
                                    </Menu.Item>
                                ))}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default SavedUsersDropdown;
