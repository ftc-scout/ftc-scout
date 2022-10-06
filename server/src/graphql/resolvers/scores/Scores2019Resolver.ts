import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Event } from "../../../db/entities/Event";
import DataLoader from "dataloader";
import { MatchScores2019AllianceGraphql } from "../../objects/MatchScores2019Graphql";
import { TeamMatchParticipation } from "../../../db/entities/TeamMatchParticipation";
import { stationMatchesAlliance } from "../../../db/entities/types/Station";

@Resolver(MatchScores2019AllianceGraphql)
export class Scores2019Resolver {
    @FieldResolver(() => Event)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let teams = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        return ids.map((id) => teams.filter((t) => t.season == id.season && t.code == id.code)[0]);
    })
    event(@Root() score: MatchScores2019AllianceGraphql) {
        return async (dl: DataLoader<{ season: number; code: string }, Event>) => {
            return dl.load({
                season: score.season,
                code: score.eventCode,
            });
        };
    }

    @FieldResolver(() => [TeamMatchParticipation])
    @Loader<{ season: number; eventCode: string; matchId: number }, TeamMatchParticipation[]>(async (ids, _) => {
        let teams = await TeamMatchParticipation.find({
            where: ids as { season: number; eventCode: string; matchId: number }[],
        });

        return ids.map((id) =>
            teams.filter((t) => t.season == id.season && t.eventCode == id.eventCode && t.matchId == id.matchId)
        );
    })
    teams(@Root() score: MatchScores2019AllianceGraphql) {
        return async (
            dl: DataLoader<{ season: number; eventCode: string; matchId: number }, TeamMatchParticipation[]>
        ) => {
            let all = await dl.load({
                season: score.season,
                eventCode: score.eventCode,
                matchId: score.matchId,
            });
            return all.filter((t) => stationMatchesAlliance(score.alliance, t.station));
        };
    }
}
