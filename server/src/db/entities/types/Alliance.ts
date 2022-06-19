import { registerEnumType } from "type-graphql";

export enum Alliance {
    RED = 0,
    BLUE = 1,
    SOLO = 2,
}

export function allianceFromString(str: "Red" | "Blue"): Alliance {
    return str == "Red" ? Alliance.RED : Alliance.BLUE;
}

registerEnumType(Alliance, {
    name: "Alliance",
});
