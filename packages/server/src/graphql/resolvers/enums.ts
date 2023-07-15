import {
    Alliance,
    AllianceRole,
    EventType,
    Station,
    TournamentLevel,
    makeGQLEnum,
} from "@ftc-scout/common";
import { AwardType } from "../../db/entities/Award";

export const AllianceGQL = makeGQLEnum(Alliance, "Alliance");
export const StationGQL = makeGQLEnum(Station, "Station");
export const AllianceRoleGQL = makeGQLEnum(AllianceRole, "AllianceRole");
export const EventTypeGQL = makeGQLEnum(EventType, "EventType");
export const TournamentLevelGQL = makeGQLEnum(TournamentLevel, "TournamentLevel");
export const AwardTypeGQL = makeGQLEnum(AwardType, "AwardTypes");
