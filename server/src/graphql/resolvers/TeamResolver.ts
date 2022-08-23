import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import DataLoader from "dataloader";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";

@Resolver(Team)
export class TeamResolver {
    @Query(() => Team, { nullable: true })
    teamByNumber(@Arg("number", () => Int) number: number): Promise<Team | null> {
        return Team.findOneBy({ number });
    }

    @Query(() => Team, { nullable: true })
    teamByName(@Arg("name", () => String) name: string): Promise<Team | null> {
        return Team.findOneBy({ name });
    }

    @FieldResolver(() => [TeamEventParticipation])
    @Loader<{ eventSeason: number; teamNumber: number }, TeamEventParticipation[]>(async (ids, _) => {
        let ids2021 = ids.filter((id) => id.eventSeason == 2021);
        let ids2019 = ids.filter((id) => id.eventSeason == 2019);

        let teps2021P = ids2021.length
            ? TeamEventParticipation2021.find({
                  where: ids2021 as { eventSeason: number; teamNumber: number }[],
              })
            : [];
        let teps2019P = ids2019.length
            ? TeamEventParticipation2019.find({
                  where: ids2019 as { eventSeason: number; teamNumber: number }[],
              })
            : [];

        let [teps2021, teps2019] = await Promise.all([teps2021P, teps2019P]);
        let teps = [...teps2021, ...teps2019];

        let groups: TeamEventParticipation[][] = ids.map((_) => []);

        for (let tep of teps) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.eventSeason == tep.eventSeason && id.teamNumber == tep.teamNumber) {
                    groups[i].push(new TeamEventParticipation(tep));
                }
            }
        }
        return groups;
    })
    events(@Root() team: Team, @Arg("season", () => Int) season: number) {
        return async (dl: DataLoader<{ eventSeason: number; teamNumber: number }, TeamEventParticipation[]>) => {
            return dl.load({ eventSeason: season, teamNumber: team.number });
        };
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
                }
            }
        }
        return groups;
    })
    awards(@Root() team: Team, @Arg("season") season: number) {
        return async (dl: DataLoader<{ season: number; teamNumber: number }, Award[]>) => {
            return dl.load({ season, teamNumber: team.number });
        };
    }
}
