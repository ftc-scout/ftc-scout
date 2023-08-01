export function nOf(count: number, name: string, pluralName: string = name + "s"): string {
    return `${count} ${count == 1 ? name : pluralName}`;
}
