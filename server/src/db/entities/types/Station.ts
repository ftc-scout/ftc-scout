import { registerEnumType } from "type-graphql";

export enum Station {
    RED_1 = 0,
    RED_2 = 1,
    RED_3 = 2,
    BLUE_1 = 3,
    BLUE_2 = 4,
    BLUE_3 = 5,
    SOLO = 6,
}

registerEnumType(Station, {
    name: "Station",
});
