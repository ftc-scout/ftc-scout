import { datesAreOnSameDay } from "../date";

export function prettyPrintDateRange(start: Date, end: Date): string {
    if (datesAreOnSameDay(start, end)) {
        return prettyPrintDate(start);
    } else {
        return `${prettyPrintDate(start)} - ${prettyPrintDate(end)}`;
    }
}

function fromStr(date: string): Date {
    let x = date.split("-");
    return new Date(+x[0], +x[1] - 1, +x[2]);
}

export function prettyPrintDateRangeString(start: string, end: string): string {
    return prettyPrintDateRange(fromStr(start), fromStr(end));
}

function prettyPrintDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
