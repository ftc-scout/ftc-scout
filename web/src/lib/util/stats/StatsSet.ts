import type { Stat } from "./Stat";
import type { StatColor } from "./stat-color";

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

export interface StatsSet<T, U> {
    standalone: Stat<T>[];
    groups: StatGroup<T, U>[];
    groupStats: NestedStat<U>[];
}
