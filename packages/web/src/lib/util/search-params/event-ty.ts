import { EventTypeOption } from "@ftc-scout/common";
import type { QueryParamOpts } from "./search-params";

export const EVENT_TY_EC_DC: QueryParamOpts<EventTypeOption> = {
    encode: (e) => (e == EventTypeOption.Competition ? null : e),
    decode: (s) => {
        if (s == null) return EventTypeOption.Competition;
        return (
            (Object.entries(EventTypeOption).find(([_, n]) => n == s)?.[0] as EventTypeOption) ??
            EventTypeOption.Competition
        );
    },
};
