import { datesAreOnSameDay } from "../date";

export function prettyPrintDateRange(start: Date, end: Date): string {
    if (datesAreOnSameDay(start, end)) {
        return prettyPrintDate(start);
    } else {
        return `${prettyPrintDate(start)} - ${prettyPrintDate(end)}`;
    }
}

function prettyPrintDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
