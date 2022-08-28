import type { Tep2019Field, Tep2019Group, Tep2021Field, Tep2021Group } from "$lib/graphql/generated/graphql-operations";
import type { Stat, StatData } from "./Stat";
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
    getInner: (t2: StatData<T>) => StatData<U>,
    stat: Stat<U>,
    color: StatColor,
    shortNameAdd: string,
    longNameAdd: string,
    identifierNameAdd: string,
    apiGroup: Tep2021Group | Tep2019Group,
    displayTypeOverride: StatDisplayType | null = null
): Stat<T> {
    return {
        read: (t: StatData<T>) => stat.read(getInner(t)),
        columnName: `${stat.columnName} ${shortNameAdd}`,
        listName: `${stat.listName} ${longNameAdd}`,
        identifierName: `${stat.identifierName} ${identifierNameAdd}`,
        displayType: displayTypeOverride ?? stat.displayType,
        color,
        apiField: {
            ...stat.apiField,
            group: apiGroup,
        } as Tep2021Field | Tep2019Field,
    };
}

export interface StatSetStandalone<T> {
    standalone: Stat<T>[];
}

export interface StatSetGroup<T, U> {
    groups: StatGroup<T, U>[];
    groupStats: NestedStat<U>[];
}

export type StatSet<T, U> = (
    | {
          name: string;
          type: "standalone";
          set: StatSetStandalone<T>;
      }
    | {
          name: string;
          type: "group";
          set: StatSetGroup<T, U>;
      }
)[];

function flattenNestedStat<T>(nestedStat: NestedStat<T>): Stat<T>[] {
    return [nestedStat.stat, ...nestedStat.nestedStats.flatMap(flattenNestedStat)];
}

function nestedStatContains<T, U>(group: StatGroup<T, U>, nestedStat: NestedStat<U>, stat: Stat<T>): boolean {
    return (
        group.get(nestedStat.stat).identifierName == stat.identifierName ||
        nestedStat.nestedStats.some((ns) => nestedStatContains(group, ns, stat))
    );
}

export function filterStatSet<T, U>(statSet: StatSet<T, U>, filterList: Stat<T>[]): Stat<T>[] {
    return filterList.filter((s) =>
        statSet.some((set) => {
            return set.type == "standalone"
                ? set.set.standalone.some((ss) => ss.identifierName == s.identifierName)
                : set.set.groups.some((g) => set.set.groupStats.some((gs) => nestedStatContains(g, gs, s)));
        })
    );
}

export function findInStatSet<T, U>(statSet: StatSet<T, U>, identifierName: string): Stat<T> | null {
    for (let set of statSet) {
        if (set.type == "standalone") {
            for (let stat of set.set.standalone) {
                if (stat.identifierName == identifierName) return stat;
            }
        } else {
            for (let groupStat of set.set.groupStats.flatMap(flattenNestedStat)) {
                for (let groupName of set.set.groups) {
                    let stat = groupName.get(groupStat);
                    if (stat.identifierName == identifierName) return stat;
                }
            }
        }
    }
    return null;
}
