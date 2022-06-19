import { registerEnumType } from "type-graphql";
import { AutoNavigation2021FtcApi } from "../../../../ftc-api/types/match-scores/MatchScores2021Trad";

export enum AutoNavigation2021 {
    NONE = 0,
    IN_STORAGE = 1,
    COMPLETELY_IN_STORAGE = 2,
    IN_WAREHOUSE = 3,
    COMPLETELY_IN_WAREHOUSE = 4,
}

export function autoNavigation2021FromApi(
    an: AutoNavigation2021FtcApi
): AutoNavigation2021 {
    return {
        NONE: AutoNavigation2021.NONE,
        IN_STORAGE: AutoNavigation2021.IN_STORAGE,
        COMPLETELY_IN_STORAGE: AutoNavigation2021.COMPLETELY_IN_STORAGE,
        IN_WAREHOUSE: AutoNavigation2021.IN_WAREHOUSE,
        COMPLETELY_IN_WAREHOUSE: AutoNavigation2021.COMPLETELY_IN_WAREHOUSE,
    }[an];
}

registerEnumType(AutoNavigation2021, {
    name: "AutoNavigation2021",
});
