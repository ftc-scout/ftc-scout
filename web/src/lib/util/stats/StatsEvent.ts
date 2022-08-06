import type { StatSet } from "./StatSet";
import type { RecordsEventFragment } from "../../graphql/generated/graphql-operations";
import type { Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

type T = {
    event: RecordsEventFragment;
};

export const EVENT_STAT: Stat<T> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.EVENT,
    listName: "Event",
    columnName: "Event",
    identifierName: "Event",
    read: (s) => ({
        name: s.event.name,
        start: s.event.start,
        end: s.event.end,
        code: s.event.code,
        season: s.event.season,
    }),
};

export let STAT_SET_EVENT: StatSet<T, never> = [
    {
        name: "Event",
        type: "standalone",
        set: {
            standalone: [EVENT_STAT],
        },
    },
];
