import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Award } from "../../db/entities/Award";
import { Event } from "../../db/entities/Event";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { Season } from "../../ftc-api/types/Season";
import DataLoader from "dataloader";

@Resolver(Event)
export class EventResolver {
    @Query(() => Event, { nullable: true })
    eventByCode(
        @Arg("season", () => Int) season: number,
        @Arg("code", () => String) code: string
    ): Promise<Event | null> {
        return Event.findOneBy({
            season,
            code,
        });
    }

    @FieldResolver(() => [TeamMatchParticipation])
    matchesForTeam(
        @Root() event: Event,
        @Arg("teamNumber", () => Int) teamNumber: number
    ): Promise<TeamMatchParticipation[]> {
        return TeamMatchParticipation.findBy({
            season: event.season,
            eventCode: event.code,
            teamNumber,
        });
    }

    @FieldResolver(() => [Award])
    @Loader<{ season: number; eventCode: string }, Award[]>(async (ids, _) => {
        let awards = await Award.find({
            where: ids as { season: number; eventCode: string }[],
        });

        let groups: Award[][] = ids.map((_) => []);

        for (let a of awards) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == a.season && id.eventCode == a.eventCode) {
                    groups[i].push(a);
                    break;
                }
            }
        }
        return groups;
    })
    awards(@Root() event: Event) {
        return async (dl: DataLoader<{ season: Season; eventCode: string }, Award[]>) => {
            return dl.load({ season: event.season, eventCode: event.code });
        };
    }
}
