import { registerEnumType } from "type-graphql";
import { Alliance } from "./Alliance";

export enum Station {
    RED_1 = 0,
    RED_2 = 1,
    RED_3 = 2,
    BLUE_1 = 3,
    BLUE_2 = 4,
    BLUE_3 = 5,
    SOLO = 6,
}

export function stationFromFtcApi(station: "Red1" | "Red2" | "Red3" | "Blue1" | "Blue2" | "Blue3" | "1"): Station {
    return {
        Red1: Station.RED_1,
        Red2: Station.RED_2,
        Red3: Station.RED_3,
        Blue1: Station.BLUE_1,
        Blue2: Station.BLUE_2,
        Blue3: Station.BLUE_3,
        1: Station.SOLO,
    }[station]!;
}

export function stationIsRed(station: Station) {
    return station == Station.RED_1 || station == Station.RED_2 || station == Station.RED_3;
}

export function stationIsBlue(station: Station) {
    return station == Station.BLUE_1 || station == Station.BLUE_2 || station == Station.BLUE_3;
}

export function stationMatchesAlliance(alliance: Alliance, station: Station): boolean {
    return (
        (alliance == Alliance.RED && stationIsRed(station)) ||
        (alliance == Alliance.BLUE && stationIsBlue(station)) ||
        alliance == Alliance.SOLO
    );
}

registerEnumType(Station, {
    name: "Station",
});
