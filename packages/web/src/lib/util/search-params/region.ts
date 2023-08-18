import { RegionOption } from "@ftc-scout/common";
import type { QueryParamOpts } from "./search-params";

export const REGION_EC_DC: QueryParamOpts<RegionOption> = {
    encode: (r) => (r == RegionOption.All ? null : r),
    decode: (s) => {
        if (s == null) return RegionOption.All;
        return (
            (Object.entries(RegionOption).find(([_, n]) => n == s)?.[0] as RegionOption) ??
            RegionOption.All
        );
    },
};
