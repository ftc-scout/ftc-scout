import type { Season } from "../../constants";

export function prettyPrintSeason(season: Season): string {
    switch (season) {
        case 2021:
            return "Freight Frenzy";
        case 2020:
            return "Ultimate Goal";
        case 2019:
            return "Skystone";
    }
}
