import Swal from 'sweetalert2';
import type { ButtonHTMLAttributes } from 'react';

type DeleteButtonPropsType = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'title'> & {
    title: string;
    text: string;
    successTitle: string;
    successText: string;
    tooltip?: string;
    onDeleteClick: () => void;
    children?: React.ReactNode;
    className?: string;
};

const DeleteButton = ({
    title,
    text,
    successTitle,
    successText,
    tooltip,
    onDeleteClick,
    children,
    className = '',
}: DeleteButtonPropsType) => {
    return (
        <button
            type="button"
            title={tooltip}
            onClick={() =>
                void Swal.fire({
                    title: title,
                    text: text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                    customClass: {
                        popup: 'bg-(--surface) text-(--text)',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        onDeleteClick();
                        void Swal.fire({
                            title: successTitle,
                            text: successText,
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            customClass: {
                                popup: 'bg-(--surface) text-(--text)',
                            },
                        });
                    }
                })
            }
            className={className}
            aria-label="Delete"
        >
            {children}
        </button>
    );
};

export default DeleteButton;
