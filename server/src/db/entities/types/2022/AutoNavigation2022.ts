import { registerEnumType } from "type-graphql";

export enum AutoNavigation2022 {
    NONE = 0,
    TERMINAL = 1,
    SIGNAL = 2,
    TEAM_SIGNAL = 3,
}

export function autoNavigation2022FromApi(
    place: "NONE" | "SIGNAL_ZONE" | "SUBSTATION_TERMINAL",
    signalSleeve: boolean
): AutoNavigation2022 {
    if (place == "NONE") {
        return AutoNavigation2022.NONE;
    } else if (place == "SIGNAL_ZONE") {
        return signalSleeve ? AutoNavigation2022.TEAM_SIGNAL : AutoNavigation2022.SIGNAL;
    } else {
        return AutoNavigation2022.TERMINAL;
    }
}

registerEnumType(AutoNavigation2022, {
    name: "AutoNavigation2022",
});
