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
