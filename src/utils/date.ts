import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export function formatDateInputValue(date: Date | null): string {
    return date ? dayjs.utc(date).format('YYYY-MM-DD') : '';
}

export function formatDateDisplayValue(date: Date | null): string {
    return date ? dayjs.utc(date).format('MMM D, YYYY') : '';
}

export function parseDateInputValue(value: string): Date | null {
    const date = dayjs.utc(value, 'YYYY-MM-DD', true);

    return date.isValid() ? date.toDate() : null;
}
