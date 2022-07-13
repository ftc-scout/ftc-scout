import type { AwardTypes2021 } from "../graphql/generated/graphql-operations";

export function sortAwards(a: AwardTypes2021, b: AwardTypes2021) {
    return awardRank(a) - awardRank(b);
}

export function awardRank(type: AwardTypes2021): number {
    return [
        "INSPIRE",
        "TOP_RANKED",
        "WINNER",
        "FINALIST",
        "DIVISION_WINNER",
        "DIVISION_FINALIST",
        "THINK",
        "CONNECT",
        "INNOVATE",
        "DESIGN",
        "MOTIVATE",
        "CONTROL",
        "PROMOTE",
        "COMPASS",
        "JUDGES_CHOICE",
        "DEANS_LIST",
    ].indexOf(type);
}
