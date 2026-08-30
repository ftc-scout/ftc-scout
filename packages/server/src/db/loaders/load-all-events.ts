import { DATA_SOURCE } from "../data-source";
import { Event } from "../../db/entities/Event";
import { Season, notEmpty } from "@ftc-scout/common";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";
import { getAllEvents } from "../../ftc-api/get-events";
import { getTeams } from "../../ftc-api/get-teams";
import { removeStaleEventTeps } from "./remove-stale-teps";
import { removeStaleEvents } from "./remove-stale-events";

export async function loadAllEvents(season: Season) {
    console.info(`Loading events for season ${season}.`);

    let apiEvents = await getAllEvents(season);

    console.info(`Fetched events.`);

    let dbEvents = apiEvents.map((api) => Event.fromApi(api, season)).filter(notEmpty);

    console.info(`Adding events to database.`);

    await DATA_SOURCE.transaction(async (em) => {
        await em.save(dbEvents, { chunk: 100 });
        await removeStaleEvents(em, season, new Set(apiEvents.map((e) => e.code!)));
        await em.save(DataHasBeenLoaded.create({ season, events: true }));
    });

    for (const event of dbEvents) {
        const apiTeamNumbers = (await getTeams(season, event.code)).map((t) => t.teamNumber);
        await removeStaleEventTeps(
            DATA_SOURCE.manager,
            season,
            event.code,
            new Set(apiTeamNumbers)
        );
    }

    console.info(`Finished loading events.`);
}
