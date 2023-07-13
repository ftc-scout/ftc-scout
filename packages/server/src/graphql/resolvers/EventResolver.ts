import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Event } from "../../db/entities/Event";
import { Award } from "../../db/entities/Award";
import { ListLoader } from "./util";
import { Season } from "@ftc-scout/common";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";

@Resolver(Event)
export class EventResolver {
    @Query(() => Event, { nullable: true })
    eventByCode(@Arg("season", () => Int) season: Season, @Arg("code", () => String) code: string) {
        return Event.findOneBy({ season, code });
    }

    @FieldResolver(() => [Award])
    @ListLoader<{ season: Season; eventCode: string }, Award>((ids) => Award.find({ where: ids }))
    awards(@Root() event: Event) {
        return { season: event.season, eventCode: event.code };
    }

    @FieldResolver(() => [TeamMatchParticipation])
    @ListLoader<{ season: Season; eventCode: string; teamNumber: number }, TeamMatchParticipation>(
        (ids) => TeamMatchParticipation.find({ where: ids })
    )
    teamMatches(@Root() event: Event, @Arg("teamNumber", () => Int) teamNumber: number) {
        return { season: event.season, eventCode: event.code, teamNumber };
    }
}
