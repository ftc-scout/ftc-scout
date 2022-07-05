import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { In } from "typeorm";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import DataLoader from "dataloader";
import { Event } from "../../db/entities/Event";

@Resolver(Award)
export class AwardResolver {
    @FieldResolver(() => Team)
    @Loader<number, Team>(async (ids, _) => {
        let teams = await Team.find({ where: { number: In(ids as number[]) } });

        return ids.map((id) => teams.filter((t) => t.number == id)[0]);
    })
    team(@Root() award: Award) {
        return async (dl: DataLoader<number, Team>) => {
            return dl.load(award.teamNumber);
        };
    }

    @FieldResolver(() => Team)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let teams = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        return ids.map(
            (id) =>
                teams.filter(
                    (t) => t.season == id.season && t.code == id.code
                )[0]
        );
    })
    event(@Root() award: Award) {
        return async (
            dl: DataLoader<{ season: number; code: string }, Event>
        ) => {
            return dl.load({
                season: award.season,
                code: award.eventCode,
            });
        };
    }
}
