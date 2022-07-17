export function prettyPrintTime(t: Date): string {
    return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function prettyPrintTimeString(time: string): string {
    return prettyPrintTime(new Date(time));
}
