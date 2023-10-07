export function arrayMove<T>(arr: T[], oldIdx: number, newIdx: number): T[] {
    if (newIdx == oldIdx) return arr;

    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (i == newIdx && newIdx < oldIdx) {
            newArr.push(arr[oldIdx]);
        }
        if (i != oldIdx) {
            newArr.push(arr[i]);
        }
        if (i == newIdx && newIdx > oldIdx) {
            newArr.push(arr[oldIdx]);
        }
    }
    return newArr;
}

export function arrayEq<T>(a: T[], b: T[]): boolean {
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }

    return true;
}

export function windows<T>(arr: T[]): [T, T][] {
    let res: [T, T][] = [];
    for (let i = 0; i + 1 < arr.length; i++) {
        res.push([arr[i], arr[i + 1]]);
    }
    return res;
}
