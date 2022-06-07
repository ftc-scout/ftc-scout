import { getAllTeams } from "../../ftc-api/get-teams";
import { Team } from "../entities/Team";

export async function loadAllTeamsIntoDatabase() {
    console.log("Fetching all teams.");

    let apiTeams = await getAllTeams();

    console.log("Fetched all teams.");

    console.log("Adding all teams to database.");

    let insertedTeamCount = 0;
    for (const apiTeam of apiTeams) {
        // There is one weird team in the db that doesn't have a city but it is inactive. We will just ignore it.
        if (apiTeam.nameShort === null || apiTeam.city === null) {
            continue;
        }

        await Team.create({
            number: apiTeam.teamNumber,
            name: apiTeam.nameShort,
            schoolName: apiTeam.nameFull,
            country: apiTeam.country,
            stateOrProvince: apiTeam.stateProv,
            city: apiTeam.city,
            rookieYear: apiTeam.rookieYear,
            website: apiTeam.website,
        } as any).save();

        insertedTeamCount++;
        if (insertedTeamCount % 1000 == 0) {
            console.log(
                `Added ${insertedTeamCount} teams. (Up to team ${apiTeam.teamNumber}).`
            );
        }
    }

    console.log("All teams added to database.");
}
