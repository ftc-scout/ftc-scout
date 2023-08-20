import { dateFromStr } from "../util/date";

const DATE_TIME_FORMAT = Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const DATE_TIME_SHORT_FORMAT = Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export function prettyPrintDateRange(start: Date, end: Date, short: boolean = false): string {
    return (short ? DATE_TIME_SHORT_FORMAT : DATE_TIME_FORMAT).formatRange(start, end);
}

export function prettyPrintDateRangeString(
    start: string,
    end: string,
    short: boolean = false
): string {
    return prettyPrintDateRange(dateFromStr(start), dateFromStr(end), short);
}
