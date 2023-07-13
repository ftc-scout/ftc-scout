import { FieldResolver, Resolver, Root } from "type-graphql";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import { Event } from "../../db/entities/Event";
import { Loader } from "./util";
import { Season } from "@ftc-scout/common";

@Resolver(Award)
export class AwardResolver {
    @FieldResolver(() => Team)
    @Loader<{ number: number }, Team>((ids) => Team.find({ where: ids }))
    team(@Root() award: Award) {
        return { number: award.teamNumber };
    }

    @FieldResolver(() => Event)
    @Loader<{ season: Season; code: string }, Event>((ids) => Event.find({ where: ids }))
    event(@Root() award: Award) {
        return { season: award.season, code: award.eventCode };
    }
}
