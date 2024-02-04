import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { type Placement } from "tippy.js";

interface Props {
    title: string;
    text: string;
    successTitle: string;
    successText: string;
    tooltip?: string;
    tooltipPlacement?: Placement;
    onDeleteClick: () => void;
    children?: React.ReactNode;
    className?: string;
}

const DeleteButton: React.FC<Props> = ({
    title,
    text,
    successTitle,
    successText,
    tooltip,
    tooltipPlacement = "top",
    onDeleteClick,
    children,
    className = "",
}) => {
    return (
        <Tippy
            content={tooltip}
            disabled={!tooltip}
            placement={tooltipPlacement}
        >
            <button
                onClick={() =>
                    void Swal.fire({
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
                            void Swal.fire({
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
                aria-label="Delete"
            >
                {children}
            </button>
        </Tippy>
    );
};

export default DeleteButton;
