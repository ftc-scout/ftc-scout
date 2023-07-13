import { Arg, Query, Resolver } from "type-graphql";
import { Team } from "../../db/entities/Team";

@Resolver(Team)
export class TeamResolver {
    @Query(() => Team, { nullable: true })
    teamByName(@Arg("name", () => String) name: string): Promise<Team | null> {
        return Team.findOneBy({ name });
    }
}
