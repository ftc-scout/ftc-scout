import {
    Alliance,
    AllianceRole,
    EventType,
    EventTypeOption,
    FilterGroupTy,
    FilterOp,
    RegionOption,
    RemoteOption,
    SortDir,
    Station,
    TournamentLevel,
    makeGQLEnum,
} from "@ftc-scout/common";
import { AwardType } from "../../db/entities/Award";

export const AllianceGQL = makeGQLEnum(Alliance, "Alliance");
export const StationGQL = makeGQLEnum(Station, "Station");
export const AllianceRoleGQL = makeGQLEnum(AllianceRole, "AllianceRole");
export const EventTypeGQL = makeGQLEnum(EventType, "EventType");
export const EventTypeOptionGQL = makeGQLEnum(EventTypeOption, "EventTypeOption");
export const RemoteOptionGQL = makeGQLEnum(RemoteOption, "RemoteOption");
export const RegionOptionGQL = makeGQLEnum(RegionOption, "RegionOption");
export const TournamentLevelGQL = makeGQLEnum(TournamentLevel, "TournamentLevel");
export const AwardTypeGQL = makeGQLEnum(AwardType, "AwardType");
export const SortDirGQL = makeGQLEnum(SortDir, "SortDir");
export const FilterOpGQL = makeGQLEnum(FilterOp, "FilterOp");
export const FilterGroupTyGQL = makeGQLEnum(FilterGroupTy, "FilterGroupTy");
