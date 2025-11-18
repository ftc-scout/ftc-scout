import { Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export type AdvancementInfo = {
    slots: number | null;
    advancesTo: string | null;
};

export async function getAdvancement(
    season: Season,
    eventCode: string
): Promise<AdvancementInfo | null> {
    let resp = await getFromFtcApi(`${season}/advancement/${eventCode}`);
    if (!resp) return null;

    let slots = resp?.["slots"];
    let advancesTo = resp?.["advancesTo"] ?? null;

    return {
        slots: typeof slots === "number" && slots > 0 ? slots : null,
        advancesTo,
    };
}
