import Swal from "sweetalert2";

function DeleteButton({
    title,
    text,
    successTitle,
    successText,
    onDeleteClick,
    children,
    className = "",
}: {
    title: string;
    text: string;
    successTitle: string;
    successText: string;
    onDeleteClick: () => void;
    children: React.ReactNode;
    className: string;
}) {
    return (
        <button
            onClick={() =>
                Swal.fire({
                    title: title,
                    text: text,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                    customClass: {
                        popup: "bg-gray-200 dark:bg-slate-900 dark:text-white",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        onDeleteClick();
                        Swal.fire({
                            title: successTitle,
                            text: successText,
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            customClass: {
                                popup: "bg-gray-200 dark:bg-slate-900 dark:text-white",
                            },
                        });
                    }
                })
            }
            className={className}
        >
            {children}
        </button>
    );
}

export default DeleteButton;
