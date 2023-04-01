import type { Season } from "../../constants";

export function prettyPrintSeason(season: Season): string {
    switch (season) {
        case 2022:
            return "Spin Up";
        case 2021:
            return "Tipping Point";
        case 2020:
            return "Change-Up";
        case 2019:
            return "Tower Takeover";
    }
}
