import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

export function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return '';
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return `http://localhost:${process.env.PORT ?? 3000}`;
}

// https://www.joshwcomeau.com/snippets/javascript/debounce/
export function debounce<T extends (...args: Parameters<T>) => void>(callback: T, wait?: number) {
    let timeoutId: number | undefined;

    return (...args: Parameters<T>) => {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            callback.call(null, ...args);
        }, wait);
    };
}
