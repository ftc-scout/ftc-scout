import { registerEnumType } from "type-graphql";

export enum WobbleEndPositions {
    NONE = 0,
    START_LINE = 1,
    DROP_ZONE = 2,
}

registerEnumType(WobbleEndPositions, {
    name: "WobbleEndPositions",
});
