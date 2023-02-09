import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            type="button"
            className={`
				${
                    theme === "dark"
                        ? "bg-blue-500 text-yellow-400"
                        : "bg-slate-900 text-white"
                } mr-4 rounded-full p-2 text-base`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
        >
            {theme && theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default DarkModeToggle;
