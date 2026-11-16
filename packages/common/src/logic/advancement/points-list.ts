import { Season } from "../Season";
import { AdvancementPointsConfig } from "./points";
import { DecodeAdvancementConfig } from "./seasons/DecodeAdvancementConfig";
// import { BioBuzzAdvancementConfig } from "./seasons/BioBuzzAdvancementConfig";

export const ADVANCEMENT_CONFIGS: Partial<Record<Season, AdvancementPointsConfig>> = {
    [Season.Decode]: DecodeAdvancementConfig,
    // [Season.BioBuzz]: BioBuzzAdvancementConfig,
};
