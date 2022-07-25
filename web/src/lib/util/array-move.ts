export function array_move<T>(arr: T[], old_index: number, new_index: number): T[] {
    let newArr = [];
    if (new_index == -1) {
        newArr.push(arr[old_index]);
    }
    for (let i = 0; i < arr.length; i++) {
        if (i != old_index) {
            newArr.push(arr[i]);
        }
        if (i == new_index) {
            newArr.push(arr[old_index]);
        }
    }
    return newArr;
}
