import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { MatchScores2021TradAllianceGraphql } from "../../objects/MatchScores2021TradGraphql";
import { Event } from "../../../db/entities/Event";
import DataLoader from "dataloader";
import { MatchScores2021RemoteGraphql } from "../../objects/MatchScores2021RemoteGraphql";

@Resolver(MatchScores2021TradAllianceGraphql)
export class Scores2021TradResolver {
    @FieldResolver(() => Event)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let teams = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        return ids.map((id) => teams.filter((t) => t.season == id.season && t.code == id.code)[0]);
    })
    event(@Root() score: MatchScores2021TradAllianceGraphql) {
        return async (dl: DataLoader<{ season: number; code: string }, Event>) => {
            return dl.load({
                season: score.season,
                code: score.eventCode,
            });
        };
    }
}

@Resolver(MatchScores2021RemoteGraphql)
export class Scores2021RemoteResolver {
    @FieldResolver(() => Event)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let teams = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        return ids.map((id) => teams.filter((t) => t.season == id.season && t.code == id.code)[0]);
    })
    event(@Root() score: MatchScores2021RemoteGraphql) {
        return async (dl: DataLoader<{ season: number; code: string }, Event>) => {
            return dl.load({
                season: score.season,
                code: score.eventCode,
            });
        };
    }
}
