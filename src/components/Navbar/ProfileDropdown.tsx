import { signOut } from "next-auth/react";
import { api } from "@/utils/api";
import { type User } from "next-auth";

import { Menu, Transition } from "@headlessui/react";
import { MdDelete, MdShare, MdContentCopy, MdLogout } from "react-icons/md";
import DeleteButton from "@/components/Util/DeleteButton";
import ImageWithFallback from "../Util/ImageWithFallback";

interface Props {
    user: User;
}

const ProfileDropdown: React.FC<Props> = ({ user }) => {
    const ctx = api.useContext();

    const getShareId = api.user.getShareId.useQuery();

    const addShareId = api.user.addShareId.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.user.getShareId.invalidate();
        },
    });

    const deleteShareId = api.user.deleteShareId.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.user.getShareId.invalidate();
        },
    });

    function shareLinkToClipboard() {
        // if shareId is set, put link with shareId in clipboard
        if (getShareId.data?.shareId)
            void navigator.clipboard.writeText(
                window.location.origin + "/" + getShareId.data.shareId
            );
    }

    return (
        <Menu as="div" className="relative z-10 inline-block">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center">
                        <ImageWithFallback
                            className="rounded-full"
                            src={
                                user.image ||
                                "https://cdn.discordapp.com/embed/avatars/1.png"
                            }
                            fallbackSrc="https://cdn.discordapp.com/embed/avatars/1.png"
                            alt={user.name || "-"}
                            width={32}
                            height={32}
                        />
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
                            className="text-dark absolute right-0 mt-2
			w-44 origin-top-right divide-y divide-black rounded-md bg-gray-100
			shadow-lg dark:divide-white dark:bg-slate-700 dark:text-white"
                        >
                            {getShareId.data?.shareId ? (
                                <>
                                    <Menu.Item>
                                        <DeleteButton
                                            title="Delete Share-Link?"
                                            text="You can always create a new one."
                                            successTitle="Deleted!"
                                            successText="Share-Link has been deleted."
                                            onDeleteClick={() =>
                                                deleteShareId.mutate()
                                            }
                                            className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                        >
                                            <MdDelete className="text-xl" />
                                            Delete Share-Link
                                        </DeleteButton>
                                    </Menu.Item>
                                    <Menu.Item
                                        as="button"
                                        className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                        onClick={() => shareLinkToClipboard()}
                                    >
                                        <MdContentCopy className="text-xl" />
                                        Copy Share-Link
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item
                                    as="button"
                                    className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                    onClick={() => addShareId.mutate()}
                                >
                                    <MdShare className="text-xl" />
                                    Create Share-Link
                                </Menu.Item>
                            )}

                            <Menu.Item
                                as="button"
                                className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                onClick={() => void signOut()}
                            >
                                <MdLogout className="text-xl" />
                                Sign out
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default ProfileDropdown;
