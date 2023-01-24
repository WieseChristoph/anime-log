import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { FaGithub, FaChevronDown } from "react-icons/fa";

const AboutDropdown: React.FC = () => {
    return (
        <Menu as="div" className="relative z-10 inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center">
                        About
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
                            <Menu.Item as="div">
                                <Link
                                    href="https://github.com/WieseChristoph/anime-log"
                                    target="_blank"
                                    legacyBehavior={false}
                                    className="flex items-center gap-2 px-2 py-2 text-sm hover:underline"
                                >
                                    <FaGithub className="text-xl" />
                                    <b>Github</b>
                                </Link>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default AboutDropdown;
