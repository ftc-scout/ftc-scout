type T = { event: { start: any } };
export function eventSorter(a: T, b: T): number {
    return new Date(b.event.start).getTime() - new Date(a.event.start).getTime();
}
