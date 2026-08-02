import { signOut } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import type { User } from 'next-auth';
import { Menu, Transition } from '@headlessui/react';
import DeleteButton from '@/components/util/delete-button';
import ImageWithFallback from '@/components/util/image-with-fallback';
import { Copy, LogOut, Share, Trash } from 'lucide-react';

const fallbackAvatarUrl = 'https://cdn.discordapp.com/embed/avatars/1.png';

type ProfileDropdownPropsType = {
    user: User;
};

const ProfileDropdown = ({ user }: ProfileDropdownPropsType) => {
    const ctx = trpc.useUtils();

    const getShareId = trpc.user.getShareId.useQuery();

    const addShareId = trpc.user.addShareId.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.user.getShareId.invalidate();
        },
    });

    const deleteShareId = trpc.user.deleteShareId.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.user.getShareId.invalidate();
        },
    });

    function shareLinkToClipboard() {
        // if shareId is set, put link with shareId in clipboard
        if (getShareId.data?.shareId)
            void navigator.clipboard.writeText(`${window.location.origin}/${getShareId.data.shareId}`);
    }

    const userImage = user?.image ?? fallbackAvatarUrl;

    return (
        <Menu as="div" className="relative z-10 inline-block">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center">
                        <ImageWithFallback
                            className="rounded-full"
                            src={userImage}
                            fallbackSrc="https://cdn.discordapp.com/embed/avatars/1.png"
                            alt={user?.name || '-'}
                            width={40}
                            height={40}
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
                        <Menu.Items className="text-dark absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-300 rounded-md bg-gray-100 shadow-lg dark:divide-slate-500 dark:bg-slate-700 dark:text-white">
                            {getShareId.data?.shareId ? (
                                <>
                                    <Menu.Item>
                                        <DeleteButton
                                            title="Delete Share-Link?"
                                            text="You can always create a new one."
                                            successTitle="Deleted!"
                                            successText="Share-Link has been deleted."
                                            onDeleteClick={() => deleteShareId.mutate()}
                                            className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                        >
                                            <Trash className="h-5 w-5" />
                                            Delete Share-Link
                                        </DeleteButton>
                                    </Menu.Item>
                                    <Menu.Item
                                        as="button"
                                        className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                        onClick={() => shareLinkToClipboard()}
                                    >
                                        <Copy className="h-5 w-5" />
                                        Copy Share-Link
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item
                                    as="button"
                                    className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                    onClick={() => addShareId.mutate()}
                                >
                                    <Share className="h-5 w-5" />
                                    Create Share-Link
                                </Menu.Item>
                            )}

                            <Menu.Item
                                as="button"
                                className="flex w-full flex-row gap-2 px-2 py-2 text-sm hover:underline"
                                onClick={() => void signOut()}
                            >
                                <LogOut className="h-5 w-5" />
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
