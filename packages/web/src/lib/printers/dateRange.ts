import { dateFromStr } from "../util/date";

const DATE_TIME_FORMAT = Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export function prettyPrintDateRange(start: Date, end: Date): string {
    return DATE_TIME_FORMAT.formatRange(start, end);
}

export function prettyPrintDateRangeString(start: string, end: string): string {
    return prettyPrintDateRange(dateFromStr(start), dateFromStr(end));
}
