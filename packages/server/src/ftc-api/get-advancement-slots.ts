import { Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export type AdvancementInfo = {
    advancementSlots: number | null;
    advancesTo: string | null;
    fcmpReserved: number | null;
    season: Season;
    advancesToEvent: string | null;
    eventCode: string;
};

export async function getAdvancementSlots(
    season: Season,
    eventCode: string
): Promise<AdvancementInfo | null> {
    let resp = await getFromFtcApi(`${season}/advancement/${eventCode}`);
    if (!resp) return null;

    let slots = resp?.["slots"];
    let advancesTo = resp?.["advancesTo"] ?? null;
    let fcmpReserved = resp?.["fcmpReserved"] ?? null;

    return {
        advancementSlots: typeof slots === "number" && slots > 0 ? slots : null,
        advancesTo,
        fcmpReserved: typeof fcmpReserved === "number" && fcmpReserved > 0 ? fcmpReserved : null,
        advancesToEvent: advancesTo,
        season,
        eventCode,
    };
}
