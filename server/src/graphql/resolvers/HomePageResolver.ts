import { Arg, Int, Query, Resolver } from "type-graphql";
import { EntityTarget } from "typeorm";
import { ALL_SEASONS } from "../../constants";
import { DATA_SOURCE } from "../../db/data-source";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { Match } from "../../db/entities/Match";

@Resolver()
export class HomePageResolver {
    // Maybe update these in the future
    @Query(() => Int)
    async activeTeamsCount(@Arg("season", () => Int) season: number): Promise<number> {
        if (ALL_SEASONS.indexOf(season) != -1) {
            let tep: EntityTarget<any> | null = null;
            switch (season) {
                case 2019:
                    tep = TeamEventParticipation2019;
                    break;
                case 2020:
                    // TODO
                    return 0;
                case 2021:
                    tep = TeamEventParticipation2021;
                    break;
            }
            let res = (await DATA_SOURCE.getRepository(tep!)
                .createQueryBuilder()
                .select('COUNT(DISTINCT("teamNumber"))')
                .getRawOne()!) as { count: string };
            return +res.count;
        } else {
            return 0;
        }
    }

    @Query(() => Int)
    async matchesPlayedCount(@Arg("season", () => Int) season: number): Promise<number> {
        let query = DATA_SOURCE.getRepository(Match)
            .createQueryBuilder("m")
            .select()
            .where('m."eventSeason" = :season', { season })
            .andWhere('m."hasBeenPlayed"');

        return query.getCount();
    }
}
