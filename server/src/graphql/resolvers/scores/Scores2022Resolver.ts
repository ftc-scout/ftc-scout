import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Event } from "../../../db/entities/Event";
import DataLoader from "dataloader";
import { MatchScores2022AllianceGraphql } from "../../objects/MatchScores2022Graphql";
import { TeamMatchParticipation } from "../../../db/entities/TeamMatchParticipation";
import { stationMatchesAlliance } from "../../../db/entities/types/Station";
import { Match } from "../../../db/entities/Match";
import { Alliance, otherAlliance } from "../../../db/entities/types/Alliance";
import { MatchScores2022 } from "../../../db/entities/MatchScores2022";

@Resolver(MatchScores2022AllianceGraphql)
export class Scores2022Resolver {
    @FieldResolver(() => Event)
    @Loader<{ season: number; code: string }, Event>(async (ids, _) => {
        let teams = await Event.find({
            where: ids as { season: number; code: string }[],
        });

        return ids.map((id) => teams.filter((t) => t.season == id.season && t.code == id.code)[0]);
    })
    event(@Root() score: MatchScores2022AllianceGraphql) {
        return async (dl: DataLoader<{ season: number; code: string }, Event>) => {
            return dl.load({
                season: score.season,
                code: score.eventCode,
            });
        };
    }

    @FieldResolver(() => Match)
    @Loader<{ eventSeason: number; eventCode: string; id: number }, Match>(async (ids, _) => {
        let matches = await Match.find({
            where: ids as { eventSeason: number; eventCode: string; id: number }[],
        });

        return ids.map(
            (id) =>
                matches.find((t) => t.eventSeason == id.eventSeason && t.eventCode == id.eventCode && t.id == id.id)!
        );
    })
    match(@Root() score: MatchScores2022AllianceGraphql) {
        return async (dl: DataLoader<{ eventSeason: number; eventCode: string; id: number }, Event>) => {
            return dl.load({
                eventSeason: score.season,
                eventCode: score.eventCode,
                id: score.matchId,
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
    teams(@Root() score: MatchScores2022AllianceGraphql) {
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

    @FieldResolver(() => MatchScores2022AllianceGraphql)
    @Loader<{ season: number; eventCode: string; matchId: number; alliance: Alliance }, MatchScores2022>(
        async (ids, _) => {
            let mappedIds = ids.map((id) => ({
                ...id,
                alliance: otherAlliance(id.alliance),
            }));

            let teams = await MatchScores2022.find({
                where: mappedIds,
            });

            return ids.map(
                (id) =>
                    teams.find(
                        (t) =>
                            t.season == id.season &&
                            t.eventCode == id.eventCode &&
                            t.matchId == id.matchId &&
                            t.alliance != id.alliance
                    )!
            );
        }
    )
    opponentsScore(@Root() score: MatchScores2022AllianceGraphql) {
        return async (
            dl: DataLoader<{ season: number; eventCode: string; matchId: number; alliance: Alliance }, MatchScores2022>
        ) => {
            let oppScore = await dl.load({
                season: score.season,
                eventCode: score.eventCode,
                matchId: score.matchId,
                alliance: score.alliance,
            });
            return new MatchScores2022AllianceGraphql(oppScore);
        };
    }
}
