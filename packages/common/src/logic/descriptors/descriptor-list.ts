import { Descriptor2019 } from "./seasons/SkystoneDescriptor";
import { Descriptor2020 } from "./seasons/UltimateGoalDescriptor";
import { Descriptor2021 } from "./seasons/FreightFrenzyDescriptor";
import { Descriptor2022 } from "./seasons/PowerPlayDescriptor";
import { Descriptor2023 } from "./seasons/CenterStageDescriptor";
import { Descriptor2024 } from "./seasons/IntoTheDeepDescriptor";
import { ALL_SEASONS, Season } from "../Season";
import { Descriptor } from "./descriptor";

// HELP: Season Specific

export const DESCRIPTORS: Record<Season, Descriptor> = {
    [Season.IntoTheDeep]: Descriptor2024,
    [Season.CenterStage]: Descriptor2023,
    [Season.PowerPlay]: Descriptor2022,
    [Season.FreightFrenzy]: Descriptor2021,
    [Season.UltimateGoal]: Descriptor2020,
    [Season.Skystone]: Descriptor2019,
};
export const DESCRIPTORS_LIST = ALL_SEASONS.map((s) => DESCRIPTORS[s]);
