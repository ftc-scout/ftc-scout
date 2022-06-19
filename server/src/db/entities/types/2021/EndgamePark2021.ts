import { registerEnumType } from "type-graphql";

export enum EndgamePark2021 {
    NONE = 0,
    IN_WAREHOUSE = 1,
    COMPLETELY_IN_WAREHOUSE = 2,
}

export function endgamePark2021FromApi(
    eg: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE"
): EndgamePark2021 {
    return {
        NONE: EndgamePark2021.NONE,
        IN_WAREHOUSE: EndgamePark2021.IN_WAREHOUSE,
        COMPLETELY_IN_WAREHOUSE: EndgamePark2021.COMPLETELY_IN_WAREHOUSE,
    }[eg];
}

registerEnumType(EndgamePark2021, {
    name: "EndgamePark2021",
});
