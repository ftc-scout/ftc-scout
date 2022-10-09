import type { StatSet } from "./StatSet";
import {
    Match2021FieldName,
    Tep2019FieldName,
    Tep2021FieldName,
    type RecordsEventFragment,
} from "../../graphql/generated/graphql-operations";
import { DisplayWhen, type Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

type T = {
    event: RecordsEventFragment;
};

export const EVENT_STAT_2021: Stat<T> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.EVENT,
    listName: "Event",
    columnName: "Event",
    identifierName: "Event",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => ({
        name: s.data.event.name,
        start: s.data.event.start,
        end: s.data.event.end,
        code: s.data.event.code,
        season: s.data.event.season,
    }),
    apiField: { fieldName: Tep2021FieldName.EventName },
};

export let STAT_SET_EVENT_2021: StatSet<T, never> = [
    {
        name: "Event",
        type: "standalone",
        set: {
            standalone: [EVENT_STAT_2021],
        },
    },
];

export const EVENT_STAT_2019: Stat<T> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.EVENT,
    listName: "Event",
    columnName: "Event",
    identifierName: "Event",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => ({
        name: s.data.event.name,
        start: s.data.event.start,
        end: s.data.event.end,
        code: s.data.event.code,
        season: s.data.event.season,
    }),
    apiField: { fieldName: Tep2019FieldName.EventName },
};

export let STAT_SET_EVENT_2019: StatSet<T, never> = [
    {
        name: "Event",
        type: "standalone",
        set: {
            standalone: [EVENT_STAT_2019],
        },
    },
];
