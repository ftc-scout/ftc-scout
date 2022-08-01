import type { Stat } from "./Stat";
import type { StatColor } from "./stat-color";
import type { StatDisplayType } from "./stat-display-type";

export interface NestedStat<T> {
    stat: Stat<T>;
    nestedStats: NestedStat<T>[];
}

export interface StatGroup<T, U> {
    longName: string;
    shortName: string;
    description: string;
    color: StatColor;
    get(_: Stat<U>): Stat<T>;
}

export function groupGetter<T, U>(
    getInner: (t2: T) => U,
    stat: Stat<U>,
    color: StatColor,
    shortNameAdd: string,
    longNameAdd: string,
    identifierNameAdd: string,
    displayTypeOverride: StatDisplayType | null = null
): Stat<T> {
    return {
        read: (t: T) => stat.read(getInner(t)),
        columnName: `${stat.columnName} ${shortNameAdd}`,
        listName: `${stat.listName} ${longNameAdd}`,
        identifierName: `${stat.identifierName} ${identifierNameAdd}`,
        displayType: displayTypeOverride ?? stat.displayType,
        color,
    };
}

export interface StatsSet<T, U> {
    standalone: Stat<T>[];
    groups: StatGroup<T, U>[];
    groupStats: NestedStat<U>[];
}

function nestedStatContains<T, U>(group: StatGroup<T, U>, nestedStat: NestedStat<U>, stat: Stat<T>): boolean {
    return (
        group.get(nestedStat.stat).identifierName == stat.identifierName ||
        nestedStat.nestedStats.some((ns) => nestedStatContains(group, ns, stat))
    );
}

export function filterStatSet<T, U>(statSet: StatsSet<T, U>, filterList: Stat<T>[]): Stat<T>[] {
    return filterList.filter(
        (s) =>
            statSet.standalone.some((ss) => ss.identifierName == s.identifierName) ||
            statSet.groups.some((g) => statSet.groupStats.some((gs) => nestedStatContains(g, gs, s)))
    );
}
