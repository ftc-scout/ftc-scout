import { RankTy } from "@ftc-scout/common";
import type { EcDc } from "./search-params";

export const RANK_TY_EC_DC = {
    encode: (ty) => (ty == RankTy.FilterSkip ? null : ty),
    decode: (s) => {
        if (s == null) return RankTy.FilterSkip;

        switch (s) {
            case RankTy.Filter:
            case RankTy.NoFilter:
            case RankTy.NoFilterSkip:
                return s;
            default:
                return RankTy.FilterSkip;
        }
    },
} satisfies EcDc<RankTy>;
