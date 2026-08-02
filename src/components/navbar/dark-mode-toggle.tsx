import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

const DarkModeToggle = () => {
    const mounted = useMounted();
    const { theme, setTheme } = useTheme();

    if (!mounted) {
        return null;
    }

    return (
        <button
            type="button"
            className={` ${theme === 'light' ? 'bg-blue-500 text-yellow-400' : 'border bg-slate-900 text-white'} mr-4 rounded-full p-2 text-base`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
        >
            {theme && theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
    );
};

export default DarkModeToggle;
