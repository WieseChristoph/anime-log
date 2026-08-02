import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import DeleteButton from '@/components/util/delete-button';
import ImageWithFallback from '@/components/util/image-with-fallback';
import { ChevronDown, Save, Trash } from 'lucide-react';
import { cn } from '@/utils/helper';

type SavedUsersDropdownPropsType = {
    urlShareId?: string;
};

const SavedUsersDropdown = ({ urlShareId }: SavedUsersDropdownPropsType) => {
    const ctx = trpc.useUtils();

    const getSavedUsers = trpc.savedUser.getAll.useQuery();

    const addSavedUser = trpc.savedUser.add.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.savedUser.getAll.invalidate();
        },
    });

    const deleteSavedUser = trpc.savedUser.delete.useMutation({
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.savedUser.getAll.invalidate();
        },
    });

    return (
        <Menu
            as="div"
            className="relative z-20 inline-block text-left"
        >
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center rounded-xl px-3 py-2 font-semibold text-slate-300 text-sm hover:bg-white/10 hover:text-white">
                        Saved Logs
                        <ChevronDown className="ml-1 h-5 w-5 ui-open:rotate-180" />
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
                        <Menu.Items className="menu-panel absolute left-0 mt-2 w-64 divide-y divide-(--border) overflow-hidden outline-none">
                            {getSavedUsers.data && getSavedUsers.data.length > 0 ? (
                                getSavedUsers.data.map((savedUserEntry) => (
                                    <Menu.Item key={savedUserEntry.savedUser.shareId}>
                                        <Link
                                            href={`/${savedUserEntry.savedUser.shareId || ''}`}
                                            legacyBehavior={false}
                                            className={cn(
                                                'menu-item flex gap-2 px-3 py-2.5 text-sm',
                                                urlShareId === savedUserEntry.savedUser.shareId &&
                                                    'bg-(--accent-soft) text-(--accent-strong)',
                                            )}
                                        >
                                            <ImageWithFallback
                                                className="inline rounded-full"
                                                src={
                                                    savedUserEntry.savedUser.image ||
                                                    'https://cdn.discordapp.com/embed/avatars/1.png'
                                                }
                                                fallbackSrc="https://cdn.discordapp.com/embed/avatars/1.png"
                                                alt={savedUserEntry.savedUser.name || '-'}
                                                width={24}
                                                height={24}
                                            />
                                            <b>{savedUserEntry.savedUser.name}</b>
                                        </Link>
                                    </Menu.Item>
                                ))
                            ) : (
                                <Menu.Item
                                    key="noSavedLogs"
                                    as="div"
                                    className="menu-item px-3 py-3 text-center text-sm"
                                >
                                    No saved logs
                                </Menu.Item>
                            )}
                            {urlShareId &&
                                getSavedUsers.data &&
                                (getSavedUsers.data.find(
                                    (savedUserEntry) => savedUserEntry.savedUser.shareId === urlShareId,
                                ) ? (
                                    <Menu.Item>
                                        <DeleteButton
                                            className="menu-item menu-item-danger flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
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
                                            <Trash className="h-5 w-5" />
                                            <b>Delete current log</b>
                                        </DeleteButton>
                                    </Menu.Item>
                                ) : (
                                    <Menu.Item
                                        as="button"
                                        className="menu-item flex w-full flex-row gap-2 px-3 py-2.5 text-sm"
                                        onClick={() =>
                                            addSavedUser.mutate({
                                                shareId: urlShareId,
                                            })
                                        }
                                    >
                                        <Save className="h-5 w-5" />
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
