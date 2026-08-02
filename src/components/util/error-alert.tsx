type ErrorAlertPropsType = {
    message?: string;
};

const ErrorAlert = ({ message }: ErrorAlertPropsType) => {
    return (
        <div
            className="mb-4 flex border-(--danger) border-t-4 bg-(--danger)/15 p-4"
            role="alert"
        >
            <svg
                className="h-5 w-5 shrink-0 text-(--danger)"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Error icon"
            >
                <title>Error icon</title>
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                ></path>
            </svg>
            <div className="ml-3 font-medium text-(--danger) text-sm">{message}</div>
        </div>
    );
};

export default ErrorAlert;
