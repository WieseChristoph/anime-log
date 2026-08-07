import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Swal from 'sweetalert2';

const swalTheme = {
    theme: 'dark' as const,
    buttonsStyling: false,
    customClass: {
        container: 'anime-log-swal-container',
        popup: 'anime-log-swal-popup',
        title: 'anime-log-swal-title',
        htmlContainer: 'anime-log-swal-text',
        actions: 'anime-log-swal-actions',
        confirmButton: 'anime-log-swal-confirm',
        cancelButton: 'anime-log-swal-cancel',
    },
};

type DeleteButtonPropsType = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'title'> & {
    title: string;
    text: string;
    successTitle: string;
    successText: string;
    tooltip?: string;
    onDeleteClick: () => Promise<void>;
    children?: ReactNode;
};

const DeleteButton = ({
    title,
    text,
    successTitle,
    successText,
    tooltip,
    onDeleteClick,
    children,
    ...buttonProps
}: DeleteButtonPropsType) => {
    const handleDelete = async () => {
        const result = await Swal.fire({
            ...swalTheme,
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await onDeleteClick();

            await Swal.fire({
                ...swalTheme,
                title: successTitle,
                text: successText,
                icon: 'success',
            });
        } catch {
            await Swal.fire({
                ...swalTheme,
                title: 'Could not delete',
                text: 'The item could not be deleted. Please try again.',
                icon: 'error',
            });
        }
    };

    return (
        <button
            {...buttonProps}
            type="button"
            title={tooltip}
            onClick={() => void handleDelete()}
        >
            {children}
        </button>
    );
};

export default DeleteButton;
