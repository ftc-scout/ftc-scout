import { Arg, Int, Query, Resolver } from "type-graphql";
import { Event } from "../../db/entities/Event";

@Resolver()
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
}
