import { EventTypes } from "$lib/graphql/generated/graphql-operations";
import { DisplayWhen, type AnyField, type AnyGroup, type Stat, type StatData } from "./Stat";
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
    apiGroup: AnyGroup,
    displayTypeOverride: StatDisplayType | null = null
): Stat<T> {
    return {
        read: (t: StatData<T>) => stat.read(getInner(t)),
        columnName: `${stat.columnName} ${shortNameAdd}`.trim(),
        listName: `${stat.listName} ${longNameAdd}`.trim(),
        identifierName: `${stat.identifierName} ${identifierNameAdd}`.trim(),
        displayType: displayTypeOverride ?? stat.displayType,
        color,
        displayWhen: stat.displayWhen,
        apiField: {
            ...stat.apiField,
            group: apiGroup,
        } as AnyField,
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

export function shouldDisplay(displayWhen: DisplayWhen, eventTypes: EventTypes): boolean {
    return (
        displayWhen == DisplayWhen.ALWAYS ||
        eventTypes == EventTypes.TradAndRemote ||
        (eventTypes == EventTypes.Trad && displayWhen == DisplayWhen.TRAD) ||
        (eventTypes == EventTypes.Remote && displayWhen == DisplayWhen.REMOTE)
    );
}

export function filterStatSet<T>(filterList: Stat<T>[], eventTypes: EventTypes): Stat<T>[] {
    return filterList.filter((s) => {
        return (
            s.displayWhen == DisplayWhen.ALWAYS ||
            eventTypes == EventTypes.TradAndRemote ||
            (eventTypes == EventTypes.Trad && s.displayWhen == DisplayWhen.TRAD) ||
            (eventTypes == EventTypes.Remote && s.displayWhen == DisplayWhen.REMOTE)
        );
    });
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
