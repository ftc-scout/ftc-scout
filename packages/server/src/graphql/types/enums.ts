import {
    Alliance,
    AllianceRole,
    AutoNav2022,
    ConeType,
    EventType,
    Station,
} from "@ftc-scout/common";
import { registerEnumType } from "type-graphql";
import { AwardTypes } from "../../db/entities/Award";

export function registerEnums() {
    // HELP: Season Specific

    // --- General ---

    registerEnumType(Alliance, {
        name: "Alliance",
    });
    registerEnumType(Station, {
        name: "Station",
    });
    registerEnumType(AllianceRole, {
        name: "AllianceRole",
    });
    registerEnumType(EventType, {
        name: "EventType",
    });
    registerEnumType(AwardTypes, {
        name: "AwardTypes",
    });

    // --- 2022 ---

    registerEnumType(AutoNav2022, {
        name: "AutoNav2022",
    });
    registerEnumType(ConeType, {
        name: "ConeType",
    });
}
