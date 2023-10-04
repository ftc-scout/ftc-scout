import { Season, calculateTeamEventStats } from "@ftc-scout/common";
import { Event } from "../entities/Event";
import { MoreThan } from "typeorm";
import { getTeams } from "../../ftc-api/get-teams";
import { DATA_SOURCE } from "../data-source";

export async function loadFutureEvents(season: Season) {
    console.info(`Loading future events for season ${season}.`);

    let events = await Event.find({
        where: { start: MoreThan(new Date()) },
        select: { code: true, remote: true },
    });

    console.info(`${events.length} future events to load.`);

    for (let { code, remote } of events) {
        let teamNumbers = (await getTeams(season, code)).map((t) => t.teamNumber);
        let dbTeps = calculateTeamEventStats(season, code, remote, [], teamNumbers);
        await DATA_SOURCE.createQueryBuilder()
            .insert()
            .into(`tep_${season}`)
            .values(dbTeps)
            .orIgnore()
            .execute();
    }

    console.info(`Finished loading future events.`);
}
