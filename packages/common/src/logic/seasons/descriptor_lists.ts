import { Season } from "../Season";
import { MatchScoreTD2021, SeasonDescriptor2021 } from "./descriptors/FreightFrenzyDescriptor";
import { MatchScoreTD2022, SeasonDescriptor2022 } from "./descriptors/PowerPlayDescriptor";
import { MatchScoreTD2019, SeasonDescriptor2019 } from "./descriptors/SkystoneDescriptor";
import { MatchScoreTD2020, SeasonDescriptor2020 } from "./descriptors/UltimateGoalDescriptor";
import { SeasonDescriptor } from "./descriptor_types";

// HELP: Season Specific

export const SEASON_DESCRIPTORS: Record<Season, SeasonDescriptor> = {
    [Season.Skystone]: SeasonDescriptor2019,
    [Season.UltimateGoal]: SeasonDescriptor2020,
    [Season.FreightFrenzy]: SeasonDescriptor2021,
    [Season.PowerPlay]: SeasonDescriptor2022,
};

export const MS_TABLE_DESCRIPTORS = {
    [Season.Skystone]: MatchScoreTD2019,
    [Season.UltimateGoal]: MatchScoreTD2020,
    [Season.FreightFrenzy]: MatchScoreTD2021,
    [Season.PowerPlay]: MatchScoreTD2022,
};
