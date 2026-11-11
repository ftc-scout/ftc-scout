import { getContext, setContext } from "svelte";

const TABLE = {};
const SECTION = {};

export type Column = "match" | "red" | "blue" | "team";

export function setTableId(season: number, eventCode: string): string {
    let id = `mt-${season}-${eventCode}`;
    setContext(TABLE, id);
    return id;
}

export function setSection(id: string | null) {
    setContext(SECTION, id);
}

export function headerId(): (column: Column) => string | undefined {
    let table = getContext<string | undefined>(TABLE);
    return (column) => table && `${table}-${column}`;
}

export function cellHeaders(): (column: Column) => string | undefined {
    let table = getContext<string | undefined>(TABLE);
    let section = getContext<string | null | undefined>(SECTION);
    return (column) => table && [section, `${table}-${column}`].filter(Boolean).join(" ");
}
