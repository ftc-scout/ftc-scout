import { registerEnumType } from "type-graphql";
import { ApiConeType } from "../../../../ftc-api/types/match-scores/MatchScores2022Trad";
import { Alliance } from "../Alliance";

export enum ConeType {
    RED_CONE = 0,
    BLUE_CONE = 1,
    RED_BEACON_1 = 2,
    RED_BEACON_2 = 3,
    BLUE_BEACON_1 = 4,
    BLUE_BEACON_2 = 5,
}

export function coneTypeFromApi(coneType: ApiConeType, myColor: Alliance): ConeType {
    switch (coneType) {
        case "MY_CONE":
            return myColor == Alliance.RED ? ConeType.RED_CONE : ConeType.BLUE_CONE;
        case "OTHER_CONE":
            return myColor == Alliance.RED ? ConeType.BLUE_CONE : ConeType.RED_CONE;
        case "MY_R1_BEACON":
            return myColor == Alliance.RED ? ConeType.RED_BEACON_1 : ConeType.BLUE_BEACON_1;
        case "MY_R2_BEACON":
            return myColor == Alliance.RED ? ConeType.RED_BEACON_2 : ConeType.BLUE_BEACON_2;
        case "OTHER_R1_BEACON":
            return myColor == Alliance.RED ? ConeType.BLUE_BEACON_1 : ConeType.RED_BEACON_1;
        case "OTHER_R2_BEACON":
            return myColor == Alliance.RED ? ConeType.BLUE_BEACON_2 : ConeType.RED_BEACON_2;
    }
}

registerEnumType(ConeType, {
    name: "ConeType",
});
