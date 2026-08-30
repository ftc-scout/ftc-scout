import { Season } from "@ftc-scout/common";
import { EntityManager } from "typeorm";
import { Event } from "../entities/Event";
import { Match } from "../entities/Match";

export async function removeStaleEvents(em: EntityManager, season: Season, apiCodes: Set<string>) {
    if (apiCodes.size === 0) return;

    const dbEvents = await em.find(Event, { where: { season }, select: { code: true } });
    const staleCodes = dbEvents.map((e) => e.code).filter((code) => !apiCodes.has(code));

    for (const code of staleCodes) {
        const hasMatches = await em.exists(Match, {
            where: { eventSeason: season, eventCode: code },
        });
        if (!hasMatches) {
            await em.delete(Event, { season, code });
            console.info(`Deleted stale event ${season}/${code}.`);
        }
    }
}
