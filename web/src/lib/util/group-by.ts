export function groupBy<T>(items: T[], grouper: (_: T) => string | number | symbol): T[][] {
    let groups: Record<string | number | symbol, T[]> = {};

    for (let item of items) {
        let key = grouper(item);

        if (groups[key] == undefined) {
            groups[key] = [item];
        } else {
            groups[key].push(item);
        }
    }

    return Object.values(groups);
}
