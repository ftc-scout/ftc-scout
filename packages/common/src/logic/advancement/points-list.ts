import { Season } from "../Season";
import { AdvancementPointsConfig } from "./points";
import { DecodeAdvancementConfig } from "./seasons/DecodeAdvancementConfig";

export const ADVANCEMENT_CONFIGS: Partial<Record<Season, AdvancementPointsConfig>> = {
    [Season.Decode]: DecodeAdvancementConfig,
};
