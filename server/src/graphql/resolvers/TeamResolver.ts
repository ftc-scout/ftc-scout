import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import DataLoader from "dataloader";

@Resolver(Team)
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

    @FieldResolver(() => [Award])
    @Loader<{ season: number; teamNumber: number }, Award[]>(async (ids, _) => {
        let awards = await Award.find({
            where: ids as { season: number; teamNumber: number }[],
        });

        let groups: Award[][] = ids.map((_) => []);

        for (let a of awards) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == a.season && id.teamNumber == a.teamNumber) {
                    groups[i].push(a);
                    break;
                }
            }
        }
        return groups;
    })
    awards(@Root() team: Team, @Arg("season") season: number) {
        return async (
            dl: DataLoader<{ season: number; teamNumber: number }, Award[]>
        ) => {
            return dl.load({ season, teamNumber: team.number });
        };
    }
}
