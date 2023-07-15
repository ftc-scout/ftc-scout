export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function groupBy<T, K extends string | number>(arr: T[], f: (_: T) => K): Record<K, T[]> {
    let ret: Record<K, T[]> = {} as Record<K, T[]>;

    for (let i of arr) {
        let k = f(i);
        ret[k] = ret[k] ?? [];
        ret[k].push(i);
    }

    return ret;
}
