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
    displayTypeOverride: StatDisplayType | null = null
): Stat<T> {
    return {
        read: (t: T) => stat.read(getInner(t)),
        shortName: `${stat.shortName} ${shortNameAdd}`,
        longName: `${stat.longName} ${longNameAdd}`,
        displayType: displayTypeOverride ?? stat.displayType,
        color,
    };
}

export interface StatsSet<T, U> {
    standalone: Stat<T>[];
    groups: StatGroup<T, U>[];
    groupStats: NestedStat<U>[];
}
