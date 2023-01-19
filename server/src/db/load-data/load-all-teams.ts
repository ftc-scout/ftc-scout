import { CURRENT_SEASON } from "../../constants";
import { DeepPartial } from "typeorm";
import { getAllTeams } from "../../ftc-api/get-teams";
import { Season } from "../../ftc-api/types/Season";
import { DATA_SOURCE } from "../data-source";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { Team } from "../entities/Team";

export async function loadAllTeamsIntoDatabase(season: Season) {
    console.log(`Fetching all teams for season ${season}.`);

    let dateStartQuery = new Date();
    let apiTeams = await getAllTeams(season);

    console.log("Fetched all teams.");

    console.log("Adding all teams to database.");

    let dbTeams: Team[] = (
        await Promise.all(
            apiTeams.map(async (apiTeam) => {
                // There is one weird team in the db that doesn't have a city but it is inactive. We will just ignore it.
                if (apiTeam.nameShort == null || apiTeam.nameFull == null || apiTeam.city == null) {
                    return null;
                }

                let schoolName: string | null;
                let sponsors: string[];

                if (apiTeam.nameFull?.includes("&")) {
                    let index = apiTeam.nameFull.lastIndexOf("&");
                    let teamNamePart = apiTeam.nameFull.slice(index + 1);
                    let sponsorsPart = apiTeam.nameFull.slice(0, index);

                    schoolName = teamNamePart.trim();
                    sponsors = sponsorsPart.split("/").map((s) => s.trim());
                } else {
                    schoolName = apiTeam.nameFull?.trim() ?? null;
                    sponsors = [];
                }

                return Team.create({
                    number: apiTeam.teamNumber,
                    name: apiTeam.nameShort.trim(),
                    schoolName,
                    sponsors,
                    country: apiTeam.country,
                    stateOrProvince: apiTeam.stateProv,
                    city: apiTeam.city,
                    rookieYear: apiTeam.rookieYear,
                    website: apiTeam.website?.trim(),
                } as DeepPartial<Team>);
            })
        )
    ).filter((x): x is Team => !!x);

    await DATA_SOURCE.transaction(async (em) => {
        if (season == CURRENT_SEASON) {
            await em.save(dbTeams);
        } else {
            // Don't override date from latest season with older seasons.
            await DATA_SOURCE.createQueryBuilder().insert().into(Team).values(dbTeams).orIgnore().execute();
        }
        await em.save(
            FtcApiMetadata.create({
                season,
                lastTeamsReq: dateStartQuery,
            })
        );
    });

    console.log("All teams added to database.");
}
