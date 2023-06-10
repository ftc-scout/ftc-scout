import { CURRENT_SEASON, Season, notEmpty } from "@ftc-scout/common";
import { getTeams } from "../../ftc-api/get-teams";
import { Team } from "../entities/Team";
import { DATA_SOURCE } from "../data-source";
import { DataHasBeenLoaded } from "../entities/DataHasBeenLoaded";

export async function loadAllTeams(season: Season) {
    console.info(`Loading teams for season ${season}.`);

    let apiTeams = await getTeams(season);

    console.info(`Fetched teams.`);

    let dbTeams = apiTeams.map(Team.fromApi).filter(notEmpty);

    console.info(`Adding teams to database.`);

    await DATA_SOURCE.transaction(async (em) => {
        if (season == CURRENT_SEASON) {
            await em.save(dbTeams, { chunk: 100 });
        } else {
            // Don't override date from latest season with older seasons.
            await em.createQueryBuilder().insert().into(Team).values(dbTeams).orIgnore().execute();
        }
        await em.save(DataHasBeenLoaded.create({ season, teams: true }));
    });

    console.info(`Finished loading teams.`);
}
