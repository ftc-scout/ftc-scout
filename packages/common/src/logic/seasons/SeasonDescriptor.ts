import { Season } from "../Season";
import { FreightFrenzyDescriptor } from "./descriptors/FreightFrenzyDescriptor";
import { PowerPlayDescriptor } from "./descriptors/PowerPlayDescriptor";
import { SkystoneDescriptor } from "./descriptors/SkystoneDescriptor";
import { UltimateGoalDescriptor } from "./descriptors/UltimateGoalDescriptor";

// HELP: Season Specific

export const SEASON_DESCRIPTORS = {
    [Season.Skystone]: SkystoneDescriptor,
    [Season.UltimateGoal]: UltimateGoalDescriptor,
    [Season.FreightFrenzy]: FreightFrenzyDescriptor,
    [Season.PowerPlay]: PowerPlayDescriptor,
} as const;

export interface SpecificSeasonDescriptor<TradAllianceScore, RemoteScore> {
    season: Season;
    hasRemote: boolean;
    columns: Column<TradAllianceScore, RemoteScore>[];
}
export type SeasonDescriptor = SpecificSeasonDescriptor<any, any>;

type DistributeColumn<TradAllianceScore, RemoteScore, U extends ColumnTypeStr> = U extends any
    ? {
          name: string;
          type: U;
          fromTradApi: (api: TradAllianceScore) => StrToColumnType<U>;
          fromRemoteApi?: (api: RemoteScore) => StrToColumnType<U>;
      }
    : never;
export type Column<TradAllianceScore, RemoteScore> = DistributeColumn<
    TradAllianceScore,
    RemoteScore,
    ColumnTypeStr
>;

export type ColumnTypeStr = "string" | "int8" | "int16" | "bool";
export type Columns<T extends SeasonDescriptor> = T["columns"][number];
export type ColumnNames<T extends SeasonDescriptor> = Columns<T>["name"];
export type StrToColumnType<T extends ColumnTypeStr> = T extends "int8" | "int16"
    ? number
    : T extends "string"
    ? string
    : T extends "bool"
    ? boolean
    : never;
