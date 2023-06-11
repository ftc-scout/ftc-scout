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

export interface SeasonDescriptor {
    season: Season;
    columns: Column[];
}

export interface Column {
    name: string;
    type: ColumnTypeStr;
}

export type ColumnTypeStr = "string" | "int" | "bool";
export type Columns<T extends SeasonDescriptor> = T["columns"][number];
export type ColumnNames<T extends SeasonDescriptor> = Columns<T>["name"];
