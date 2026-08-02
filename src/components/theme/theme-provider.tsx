'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
type ThemeContextValue = {
    theme: ThemePreference;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isThemePreference = (value: string | null): value is ThemePreference =>
    value === 'light' || value === 'dark' || value === 'system';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemePreference>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('anime-log-theme');
        if (isThemePreference(storedTheme)) {
            setThemeState(storedTheme);
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const applyTheme = () => {
            const nextTheme: ResolvedTheme = theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
            document.documentElement.dataset.theme = nextTheme;
            setResolvedTheme(nextTheme);
        };

        applyTheme();
        if (theme === 'system') {
            mediaQuery.addEventListener('change', applyTheme);
        }

        return () => mediaQuery.removeEventListener('change', applyTheme);
    }, [theme]);

    const setTheme = useCallback((nextTheme: ThemePreference) => {
        window.localStorage.setItem('anime-log-theme', nextTheme);
        setThemeState(nextTheme);
    }, []);

    const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [resolvedTheme, setTheme, theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return value;
}
