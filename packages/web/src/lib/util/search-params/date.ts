import { dateFromStr, dateToStr } from "../date";
import type { EcDc } from "./search-params";

export const DATE_EC_DC: EcDc<Date | null> = {
    encode: (e) => (e ? dateToStr(e) : null),
    decode: (s) => {
        if (!s) return null;
        try {
            return dateFromStr(s);
        } catch {
            return null;
        }
    },
};
