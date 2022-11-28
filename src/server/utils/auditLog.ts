import dayjs from "dayjs";

export function log(
    route: string,
    ipAddress?: string,
    userId?: string,
    success = true,
    message?: string
) {
    console.log(
        `[${dayjs().format(
            "DD/MM/YYYY HH:MM:SS"
        )}] IP_ADDRESS=${ipAddress}, USER_ID=${userId}, ROUTE=${route}, SUCCESS=${success}, MESSAGE="${message}"`
    );
}
