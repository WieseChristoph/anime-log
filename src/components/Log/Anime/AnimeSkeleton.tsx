import { motion } from "framer-motion";

interface Props {
    index: number;
}

const AnimeSkeleton: React.FC<Props> = ({ index }) => {
    return (
        <motion.div
            className={`relative rounded
            bg-gray-200 shadow-sm shadow-gray-400
			dark:bg-slate-900 dark:text-white`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.3, delay: index * 0.05 },
            }}
            exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.3 },
            }}
            layout
        >
            <div className="flex animate-pulse flex-col sm:flex-row">
                {/* Image */}
                <div
                    className={`flex h-[210px] w-[150px] items-center justify-center rounded bg-gray-300 dark:bg-gray-700`}
                >
                    <svg
                        className={`h-12 w-12 text-gray-200`}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 640 512"
                    >
                        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                    </svg>
                </div>

                <div
                    className={`sm:grid-rows-1] grid flex-1 grid-cols-1 grid-rows-2 py-2 sm:grid-cols-2`}
                >
                    {/* Title, rating and notes */}
                    <div className="flex flex-col overflow-hidden px-2">
                        <div>
                            {/* Rating */}
                            <div className="float-right mt-1 mr-2 h-4 w-[50px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            {/* Title */}
                            <div className="mb-2 mt-1 h-4  max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            {/* Start Date */}
                            <div className="mb-1 h-3 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            {/* Updated At */}
                            <div className="mb-2 h-2 max-w-[150px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            <hr className="border-black dark:border-white" />
                        </div>
                        {/* Notes */}
                        <div className="h-full space-y-2.5 overflow-y-auto pt-2">
                            <div className="flex w-full items-center space-x-2">
                                <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="flex w-full max-w-[480px] items-center space-x-2">
                                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="flex w-full max-w-[400px] items-center space-x-2">
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="flex w-full max-w-[480px] items-center space-x-2">
                                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="flex w-full max-w-[440px] items-center space-x-2">
                                <div className="h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="flex w-full max-w-[360px] items-center space-x-2">
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                        </div>
                    </div>

                    {/* Season, Movie, OVA */}
                    <div className="flex flex-col border-black px-2 dark:border-white sm:border-l">
                        <div className="basis-1/3">
                            <div className="mb-2 mt-1 h-4 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="basis-1/3">
                            <hr className="border-black dark:border-white" />
                            <div className="mb-2 mt-1 h-4 max-w-[75px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="basis-1/3">
                            <hr className="border-black dark:border-white" />
                            <div className="mb-2 mt-1 h-4 max-w-[50px] rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnimeSkeleton;
