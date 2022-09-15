import { registerEnumType } from "type-graphql";
import { AutoNavigation2020FtcApi } from "../../../../ftc-api/types/match-scores/MatchScores2020Trad";

export enum AutoNavigation2020 {
    NONE = 0,
    PAST_LAUNCH_LINE = 1,
}

export function autoNavigation2020FromApi(an: AutoNavigation2020FtcApi): AutoNavigation2020 {
    return {
        NONE: AutoNavigation2020.NONE,
        PAST_LAUNCH_LINE: AutoNavigation2020.PAST_LAUNCH_LINE,
    }[an];
}

registerEnumType(AutoNavigation2020, {
    name: "AutoNavigation2020",
});
