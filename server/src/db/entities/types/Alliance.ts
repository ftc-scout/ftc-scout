import { registerEnumType } from "type-graphql";

export enum Alliance {
    RED = 0,
    BLUE = 1,
    SOLO = 2,
}

export function allianceFromString(str: "Red" | "Blue"): Alliance {
    return str == "Red" ? Alliance.RED : Alliance.BLUE;
}

export function otherAlliance(alliance: Alliance): Alliance {
    switch (alliance) {
        case Alliance.BLUE:
            return Alliance.RED;
        case Alliance.RED:
            return Alliance.BLUE;
        default:
            return Alliance.SOLO;
    }
}

registerEnumType(Alliance, {
    name: "Alliance",
});
