//https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript

import dayjs from 'dayjs';

dayjs.locale("hr")

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
    return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== "object")
        return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = dayjs(value);
        else if (typeof value === "object") handleDates(value);
    }
}
