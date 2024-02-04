import { type FC } from "react";
import { api } from "@/utils/api";
import { user_role } from "@prisma/client";
import dayjs from "dayjs";

import { Disclosure, Transition } from "@headlessui/react";
import ErrorAlert from "../Util/ErrorAlert";
import DeleteButton from "../Util/DeleteButton";
import ImageWithFallback from "../Util/ImageWithFallback";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const AdminUsers: FC = () => {
    const ctx = api.useContext();
    const getAllUsers = api.user.getAll.useQuery();
    const getAnimeMangaCount = api.anime.getCountByUser.useQuery();
    const getLastUpdated = api.anime.getLastUpdateByUser.useQuery();
    const deleteUser = api.user.delete.useMutation({
        onMutate: async (deletedUser) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await ctx.user.getAll.cancel();

            // Optimistically update to the new value
            ctx.user.getAll.setData(undefined, (data) => {
                return data?.filter((u) => u.id !== deletedUser.userId);
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            void ctx.user.getAll.invalidate();
        },
    });

    // Error Alert
    if (
        getAllUsers.isError ||
        deleteUser.isError ||
        getAnimeMangaCount.isError ||
        getLastUpdated.isError
    )
        return (
            <div className="p-5">
                <ErrorAlert
                    message={
                        getAllUsers.error?.message ||
                        deleteUser.error?.message ||
                        getAnimeMangaCount.error?.message ||
                        getLastUpdated.error?.message
                    }
                />
            </div>
        );

    return (
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {getAllUsers.data?.map((user, userIndex) => (
                <Disclosure key={userIndex} as="div" className="grow">
                    <Disclosure.Button className="flex w-full items-center gap-2 rounded-t border-x border-t border-gray-300 bg-gray-200 p-4 py-2 shadow-md ui-not-open:rounded-b ui-not-open:border-b dark:border-slate-700 dark:bg-slate-800">
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
                        <span>{user.name}</span>
                        <span
                            className={`ml-auto rounded px-2.5 py-0.5 text-xs font-medium ${
                                user.role === user_role.ADMIN
                                    ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                        >
                            {user.role}
                        </span>
                        <ChevronDown className="ui-open:rotate-180" />
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-y-50 opacity-0"
                        enterTo="transform scale-y-100 opacity-100 origin-top"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-y-100 opacity-100"
                        leaveTo="transform scale-y-50 opacity-0 origin-top"
                    >
                        <Disclosure.Panel
                            className="flex flex-col rounded-b border-x border-b border-gray-300 bg-gray-200 pb-4 text-black dark:border-slate-700 dark:bg-slate-800
dark:text-white"
                        >
                            <table>
                                <tbody>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>User ID</b>
                                        </td>
                                        <td className="text-center">
                                            {user.id || "-"}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>E-Mail</b>
                                        </td>
                                        <td className="text-center">
                                            {user.email || "-"}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>Share ID</b>
                                        </td>
                                        <td className="text-center">
                                            {user.shareId ? (
                                                <Link
                                                    href={`/${user.shareId}`}
                                                    target="_blank"
                                                    className="hover:underline"
                                                >
                                                    {user.shareId}
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>Sessions</b>
                                        </td>
                                        <td className="text-center">
                                            {user.sessions.length || "0"}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>Total anime</b>
                                        </td>
                                        <td className="text-center">
                                            {getAnimeMangaCount.data?.find(
                                                (e) => e.userId === user.id
                                            )?._count._all || "0"}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="w-32 px-2 py-2">
                                            <b>Last update</b>
                                        </td>
                                        <td className="text-center">
                                            {(() => {
                                                const updatedAt =
                                                    getLastUpdated.data?.find(
                                                        (e) =>
                                                            e.userId === user.id
                                                    )?.updatedAt;
                                                return updatedAt
                                                    ? dayjs(updatedAt).format(
                                                          "DD.MM.YYYY HH:mm:ss"
                                                      )
                                                    : "-";
                                            })()}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="w-32 px-2 py-2">
                                            <b>Last online</b>
                                        </td>
                                        <td className="text-center">
                                            {(() => {
                                                const lastOnline = user.sessions
                                                    .sort(
                                                        (sessionA, sessionB) =>
                                                            dayjs(
                                                                sessionB.expires
                                                            ).diff(
                                                                sessionA.expires
                                                            )
                                                    )
                                                    .at(0)?.expires;
                                                return lastOnline
                                                    ? dayjs(lastOnline)
                                                          .subtract(30, "days")
                                                          .format(
                                                              "DD.MM.YYYY HH:mm:ss"
                                                          )
                                                    : "> 30 days ago";
                                            })()}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>Saved by</b>
                                        </td>
                                        <td className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 py-2">
                                            {user.savedByUsers.map(
                                                (savedByUser) => (
                                                    <span
                                                        key={savedByUser.id}
                                                        className="rounded bg-white px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-slate-900 dark:text-gray-300"
                                                    >
                                                        {
                                                            getAllUsers.data.find(
                                                                (u) =>
                                                                    u.id ===
                                                                    savedByUser.userId
                                                            )?.name
                                                        }
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300 dark:border-slate-400">
                                        <td className="px-2 py-2">
                                            <b>Saved</b>
                                        </td>
                                        <td className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 py-2 ">
                                            {user.savedUsers.map(
                                                (savedUser) => (
                                                    <span
                                                        key={savedUser.id}
                                                        className="rounded bg-white px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-slate-900 dark:text-gray-300"
                                                    >
                                                        {
                                                            getAllUsers.data.find(
                                                                (u) =>
                                                                    u.id ===
                                                                    savedUser.savedUserId
                                                            )?.name
                                                        }
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <DeleteButton
                                className="mx-auto mt-4 w-2/3 rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                title={`Delete user "${user.name || ""}"?`}
                                text="This will also delete all anime and manga!"
                                successTitle="Deleted!"
                                successText={`User "${
                                    user.name || ""
                                }" has been deleted.`}
                                onDeleteClick={() =>
                                    deleteUser.mutate({ userId: user.id })
                                }
                            >
                                <b>Delete user</b>
                            </DeleteButton>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
            ))}
        </div>
    );
};

export default AdminUsers;
