import type { StatSet } from "./StatSet";
import { Tep2021FieldName, type RecordsEventFragment } from "../../graphql/generated/graphql-operations";
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
        name: s.data.event.name,
        start: s.data.event.start,
        end: s.data.event.end,
        code: s.data.event.code,
        season: s.data.event.season,
    }),
    apiField: { fieldName: Tep2021FieldName.EventName }, // TODO
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
