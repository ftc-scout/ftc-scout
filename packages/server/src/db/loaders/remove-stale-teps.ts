import { Season } from "@ftc-scout/common";
import { EntityManager, In } from "typeorm";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { TeamEventParticipationSchemas as TepSchemas } from "../entities/dyn/team-event-participation";

export async function removeStaleEventTeps(
    em: EntityManager,
    season: Season,
    eventCode: string,
    keepNumbers: Set<number>
) {
    if (keepNumbers.size === 0) return;

    const tepRepo = em.getRepository(TepSchemas[season]);
    const dbRows = await tepRepo.findBy({ season, eventCode });
    const staleNumbers = dbRows.map((r) => r.teamNumber).filter((n) => !keepNumbers.has(n));

    if (staleNumbers.length === 0) return;

    const teamsWithMatches = new Set(
        (
            await em.find(TeamMatchParticipation, {
                where: { season, eventCode, teamNumber: In(staleNumbers) },
                select: { teamNumber: true },
            })
        ).map((r) => r.teamNumber)
    );

    for (const teamNumber of staleNumbers) {
        if (!teamsWithMatches.has(teamNumber)) {
            await tepRepo.delete({ season, eventCode, teamNumber });
            console.info(`Deleted stale TEP ${season}/${eventCode}/${teamNumber}.`);
        }
    }
}
