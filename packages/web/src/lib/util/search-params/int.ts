export function INT_EC_DC(def: number, min: number, max: number) {
    return {
        encode: (n: number) => (n == def ? null : n + ""),
        decode: (s: string | null) => (s && !isNaN(+s) && +s <= max && +s >= min ? +s : def),
    };
}

export const PAGE_EC_DC = INT_EC_DC(1, 1, Infinity);
