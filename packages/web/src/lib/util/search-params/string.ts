import type { QueryParamOpts } from "./search-params";

export const STRING_EC_DC: QueryParamOpts<string> = {
    encode: (s) => (s.trim() == "" ? null : s),
    decode: (s) => s ?? "",
};
