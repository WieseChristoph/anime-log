import dayjs from "dayjs";

export function log(
    route: string,
    ipAddress?: string,
    userId?: string,
    success = true,
    message?: string
) {
    console.log(
        `[${dayjs().format("DD/MM/YYYY HH:MM:SS")}] IP_ADDRESS=${
            ipAddress || "undefined"
        }, USER_ID=${userId || "undefined"}, ROUTE=${route}, SUCCESS=${
            success.toString() || "undefined"
        }, MESSAGE="${message || "undefined"}"`
    );
}
