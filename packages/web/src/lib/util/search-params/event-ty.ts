import { EventTypeOption, RemoteOption } from "@ftc-scout/common";
import type { EcDc } from "./search-params";

export const EVENT_TY_EC_DC: EcDc<EventTypeOption> = {
    encode: (e) => (e == EventTypeOption.Competition ? null : e),
    decode: (s) => {
        if (s == null) return EventTypeOption.Competition;
        return (
            (Object.entries(EventTypeOption).find(([_, n]) => n == s)?.[0] as EventTypeOption) ??
            EventTypeOption.Competition
        );
    },
};

export const REMOTE_EC_DC = {
    encode: (r) => (r == RemoteOption.All ? null : r),
    decode: (s) => {
        if (s == null) return RemoteOption.All;
        switch (s) {
            case RemoteOption.Remote:
            case RemoteOption.Trad:
                return s;
            default:
                return RemoteOption.All;
        }
    },
} satisfies EcDc<RemoteOption>;
