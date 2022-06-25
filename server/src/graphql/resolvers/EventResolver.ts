import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Event } from "../../db/entities/Event";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";

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
}
