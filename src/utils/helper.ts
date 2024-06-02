export function isConsecutive(array: Array<number>): boolean {
    const sorted = [...array].sort((a, b) => a - b);
    let prev = 0;
    let isFirst = true;

    for (const element of sorted) {
        if (!isFirst && prev + 1 !== element) return false;
        if (isFirst) isFirst = false;
        prev = element;
    }
    return true;
}

export function getBaseUrl() {
    if (typeof window !== "undefined") {
        return "";
    }
    // reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

// https://www.joshwcomeau.com/snippets/javascript/debounce/
export function debounce<T extends (...args: Parameters<T>) => void>(callback: T, wait?: number) {
    let timeoutId: number | undefined = undefined;

    return (...args: Parameters<T>) => {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            callback.call(null, ...args);
        }, wait);
    }
}
