export function prettyPrintTime(t: Date): string {
    // Timezones are in the event's local time so we use UTC meaning no offset.
    return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}

export function prettyPrintTimeString(time: string): string {
    return prettyPrintTime(new Date(time));
}
