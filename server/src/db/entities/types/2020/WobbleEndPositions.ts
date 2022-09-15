import { registerEnumType } from "type-graphql";

export enum WobbleEndPositions {
    NONE = 0,
    DROP_ZONE = 1,
    START_LINE = 2,
}

export function wobbleEndPositionsFromApi(eg: "NONE" | "DROP_ZONE" | "START_LINE"): WobbleEndPositions {
    return {
        NONE: WobbleEndPositions.NONE,
        DROP_ZONE: WobbleEndPositions.DROP_ZONE,
        START_LINE: WobbleEndPositions.START_LINE,
    }[eg];
}

registerEnumType(WobbleEndPositions, {
    name: "WobbleEndPositions",
});
