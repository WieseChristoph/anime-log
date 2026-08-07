import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Copy, LogOut, Share, Trash } from 'lucide-react';
import { signOut } from 'next-auth/react';
import DeleteButton from '@/components/util/delete-button';
import ImageWithFallback from '@/components/util/image-with-fallback';
import { trpc } from '@/utils/trpc';

const fallbackAvatarUrl = 'https://cdn.discordapp.com/embed/avatars/1.png';

type ProfileDropdownPropsType = {
    user: {
        name?: string | null;
        image?: string | null;
    };
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
        if (getShareId.data?.shareId) {
            void navigator.clipboard.writeText(`${window.location.origin}/${getShareId.data.shareId}`);
        }
    }

    const userImage = user?.image ?? fallbackAvatarUrl;

    return (
        <Menu
            as="div"
            className="relative z-10 inline-block"
        >
            {({ open }) => (
                <>
                    <MenuButton className="flex items-center">
                        <ImageWithFallback
                            className="rounded-full"
                            src={userImage}
                            fallbackSrc="https://cdn.discordapp.com/embed/avatars/1.png"
                            alt={user?.name || '-'}
                            width={40}
                            height={40}
                        />
                    </MenuButton>
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
                        <MenuItems className="menu-panel absolute right-0 mt-2 w-56 origin-top-right divide-y divide-(--border) overflow-hidden outline-none">
                            {getShareId.data?.shareId ? (
                                <>
                                    <MenuItem>
                                        <DeleteButton
                                            title="Delete Share-Link?"
                                            text="You can always create a new one."
                                            successTitle="Deleted!"
                                            successText="Share-Link has been deleted."
                                            onDeleteClick={() => deleteShareId.mutate()}
                                            className="menu-item menu-item-danger flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
                                        >
                                            <Trash className="h-5 w-5" />
                                            Delete Share-Link
                                        </DeleteButton>
                                    </MenuItem>
                                    <MenuItem
                                        as="button"
                                        className="menu-item flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
                                        onClick={() => shareLinkToClipboard()}
                                    >
                                        <Copy className="h-5 w-5" />
                                        Copy Share-Link
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem
                                    as="button"
                                    className="menu-item flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
                                    onClick={() => addShareId.mutate()}
                                >
                                    <Share className="h-5 w-5" />
                                    Create Share-Link
                                </MenuItem>
                            )}

                            <MenuItem
                                as="button"
                                className="menu-item flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
                                onClick={() => void signOut()}
                            >
                                <LogOut className="h-5 w-5" />
                                Sign out
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default ProfileDropdown;
