import { Descriptor2019 } from "./seasons/SkystoneDescriptor";
import { Descriptor2020 } from "./seasons/UltimateGoalDescriptor";
import { Descriptor2021 } from "./seasons/FreightFrenzyDescriptor";
import { Descriptor2022 } from "./seasons/PowerPlayDescriptor";
import { Season } from "../Season";
import { Descriptor } from "./descriptor";

// HELP: Season Specific

export const DESCRIPTORS: Record<Season, Descriptor> = {
    [Season.Skystone]: Descriptor2019,
    [Season.UltimateGoal]: Descriptor2020,
    [Season.FreightFrenzy]: Descriptor2021,
    [Season.PowerPlay]: Descriptor2022,
};
export const DESCRIPTORS_LIST = Object.values(DESCRIPTORS);
