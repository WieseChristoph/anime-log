import { signOut } from "next-auth/react";
import Image from "next/image";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import { User } from "next-auth";
import { trpc } from "@/utils/trpc";

interface Props {
    user: User;
}

function ProfileDropdown({ user }: Props) {
    const ctx = trpc.useContext();

    const getShareId = trpc.useQuery(["user.get-shareId"]);

    const addShareId = trpc.useMutation(["user.add-shareId"], {
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["user.get-shareId"]);
        },
    });

    const deleteShareId = trpc.useMutation(["user.delete-shareId"], {
        // Always refetch after error or success:
        onSettled: () => {
            ctx.invalidateQueries(["user.get-shareId"]);
        },
    });

    function shareLinkToClipboard() {
        // if shareId is set, put link with shareId in clipboard
        if (getShareId.data?.shareId)
            navigator.clipboard.writeText(
                window.location.origin + "/" + getShareId.data.shareId
            );
    }

    return (
        <Menu as="div" className="relative z-50 inline-block">
            {({ open }) => (
                <>
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
                            className="text-dark absolute right-0 mt-2 w-40
			origin-top-right divide-y divide-black rounded-md bg-gray-100 shadow-lg
			dark:divide-white dark:bg-slate-700 dark:text-white"
                        >
                            {getShareId.data?.shareId ? (
                                <>
                                    <Menu.Item
                                        as="button"
                                        className="w-full px-2 py-2 text-sm text-red-600 hover:underline"
                                        onClick={() =>
                                            window.confirm(
                                                "Are you sure you want to delete your Share-Link?"
                                            ) && deleteShareId.mutate()
                                        }
                                    >
                                        Delete Share-Link
                                    </Menu.Item>
                                    <Menu.Item
                                        as="button"
                                        className="w-full px-2 py-2 text-sm hover:underline"
                                        onClick={() => shareLinkToClipboard()}
                                    >
                                        Copy Share-Link
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item
                                    as="button"
                                    className="w-full px-2 py-2 text-sm text-blue-600 hover:underline"
                                    onClick={() => addShareId.mutate()}
                                >
                                    Create Share-Link
                                </Menu.Item>
                            )}

                            <Menu.Item
                                as="button"
                                className="w-full px-2 py-2 text-sm hover:underline"
                                onClick={() => signOut()}
                            >
                                Sign out
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
}

ProfileDropdown.propTypes = {
    user: PropTypes.object.isRequired,
};

export default ProfileDropdown;
