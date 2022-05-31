import { Arg, Int, Query, Resolver } from "type-graphql";
import { Team } from "../../db/entities/Team";

@Resolver()
export class TeamResolver {
    @Query(() => Team, { nullable: true })
    teamByNumber(
        @Arg("number", () => Int) number: number
    ): Promise<Team | null> {
        return Team.findOneBy({ number });
    }
    @Query(() => Team, { nullable: true })
    teamByName(@Arg("name", () => String) name: string): Promise<Team | null> {
        return Team.findOneBy({ name });
    }
}
