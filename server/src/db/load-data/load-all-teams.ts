import { DeepPartial } from "typeorm";
import { getAllTeams } from "../../ftc-api/get-teams";
import { Season } from "../../ftc-api/types/Season";
import { FTCSDataSource } from "../data-source";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { Team } from "../entities/Team";

export async function loadAllTeamsIntoDatabase(season: Season) {
    console.log(`Fetching all teams for season ${season}.`);

    let dateStartQuery = new Date();
    let since = await FtcApiMetadata.getLastTeamsReq(season);
    let apiTeams = await getAllTeams(season, since);

    console.log("Fetched all teams.");

    console.log("Adding all teams to database.");

    let dbTeams: Team[] = (
        await Promise.all(
            apiTeams.map(async (apiTeam) => {
                // There is one weird team in the db that doesn't have a city but it is inactive. We will just ignore it.
                if (apiTeam.nameShort === null || apiTeam.city === null) {
                    return null;
                }

                return await Team.create({
                    number: apiTeam.teamNumber,
                    name: apiTeam.nameShort,
                    schoolName: apiTeam.nameFull,
                    country: apiTeam.country,
                    stateOrProvince: apiTeam.stateProv,
                    city: apiTeam.city,
                    rookieYear: apiTeam.rookieYear,
                    website: apiTeam.website,
                } as DeepPartial<Team>);
            })
        )
    ).filter((x): x is Team => !!x);

    FTCSDataSource.transaction(async (em) => {
        em.save(dbTeams);
        em.save(
            FtcApiMetadata.create({ season, lastTeamsReq: dateStartQuery })
        );
    });

    console.log("All teams added to database.");
}
