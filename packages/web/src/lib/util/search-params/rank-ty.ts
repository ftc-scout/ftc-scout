import { RankTy } from "@ftc-scout/common";
import type { EcDc } from "./search-params";

export const RANK_TY_EC_DC = {
    encode: (ty) => (ty == RankTy.NoFilterSkip ? null : ty),
    decode: (s) => {
        if (s == null) return RankTy.NoFilterSkip;

        switch (s) {
            case RankTy.Filter:
            case RankTy.FilterSkip:
            case RankTy.NoFilter:
                return s;
            default:
                return RankTy.NoFilterSkip;
        }
    },
} satisfies EcDc<RankTy>;
