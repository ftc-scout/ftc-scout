import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Team } from "../../db/entities/Team";
import { Award } from "../../db/entities/Award";
import { Season } from "@ftc-scout/common";
import { ListLoader } from "./util";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";

@Resolver(Team)
export class TeamResolver {
    @Query(() => Team, { nullable: true })
    teamByName(@Arg("name", () => String) name: string): Promise<Team | null> {
        return Team.findOneBy({ name });
    }

    @Query(() => Team, { nullable: true })
    teamByNumber(@Arg("number", () => Int) number: number): Promise<Team | null> {
        return Team.findOneBy({ number });
    }

    @FieldResolver(() => [TeamMatchParticipation])
    @ListLoader<{ season?: Season; teamNumber: number }, TeamMatchParticipation>((ids) =>
        TeamMatchParticipation.find({ where: ids })
    )
    matches(
        @Root() team: Team,
        @Arg("season", () => Int, { nullable: true }) season: Season | null
    ): { season?: Season; teamNumber: number } {
        return season ? { season, teamNumber: team.number } : { teamNumber: team.number };
    }

    @FieldResolver(() => [Award])
    @ListLoader<{ season?: Season; teamNumber: number }, Award>((ids) => Award.find({ where: ids }))
    awards(
        @Root() team: Team,
        @Arg("season", () => Int, { nullable: true }) season: Season | null
    ): { season?: Season; teamNumber: number } {
        return season ? { season, teamNumber: team.number } : { teamNumber: team.number };
    }
}
