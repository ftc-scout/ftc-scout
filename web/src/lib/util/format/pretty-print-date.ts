import { datesAreOnSameDay } from "../date";

export function prettyPrintDateRange(start: Date, end: Date): string {
    if (datesAreOnSameDay(start, end)) {
        return prettyPrintDate(start);
    } else {
        return `${prettyPrintDate(start)} - ${prettyPrintDate(end)}`;
    }
}

export function dateFromStr(date: string): Date {
    let x = date.split("-");
    return new Date(+x[0], +x[1] - 1, +x[2]);
}

const p = (s: any, n: number) => s.toString().padStart(n, "0");
export const dateToStr = (d: Date | null) =>
    d ? `${p(d.getFullYear(), 4)}-${p(d.getMonth() + 1, 2)}-${p(d.getDate(), 2)}` : null;

export function prettyPrintDateRangeString(start: string, end: string): string {
    return prettyPrintDateRange(dateFromStr(start), dateFromStr(end));
}

function prettyPrintDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
