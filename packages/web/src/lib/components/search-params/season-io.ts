import { ALL_SEASONS, CURRENT_SEASON, type Season } from "@ftc-scout/common";
import type { EncodeAndDecodeOptions } from "./search-params";

export const SEASON_ENCODE: EncodeAndDecodeOptions<Season> = {
    encode: (val: Season) => (val == CURRENT_SEASON ? undefined : "" + val),
    decode: (val: string | null): Season =>
        ALL_SEASONS.find((s) => "" + s == val) ?? CURRENT_SEASON,
};
