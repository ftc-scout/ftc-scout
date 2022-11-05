export function prettyPrintTime(t: Date, timeZone: string): string {
    return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone });
}

export function prettyPrintTimeString(time: string, timeZone: string): string {
    return prettyPrintTime(new Date(time), timeZone);
}
