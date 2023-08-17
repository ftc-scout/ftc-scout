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
