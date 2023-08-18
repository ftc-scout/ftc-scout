function treatAsUTC(date: Date): Date {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

export function addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function daysBetween(startDate: Date, endDate: Date): number {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round(
        (treatAsUTC(endDate).valueOf() - treatAsUTC(startDate).valueOf()) / millisecondsPerDay
    );
}

export function dateFromStr(date: string): Date {
    let [y, m, d] = date.split("-");
    return new Date(+y, +m - 1, +d);
}

export function dateToStr(date: Date | null): string | null {
    if (date == null) return null;

    let y = date.getFullYear().toString().padStart(4, "0");
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}
