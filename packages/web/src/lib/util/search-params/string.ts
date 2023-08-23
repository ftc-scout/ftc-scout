import type { EcDc } from "./search-params";

export const STRING_EC_DC: EcDc<string> = {
    encode: (s) => (s.trim() == "" ? null : s),
    decode: (s) => s ?? "",
};
