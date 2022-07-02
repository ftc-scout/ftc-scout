import { FieldResolver, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Match } from "../../db/entities/Match";
import { MatchScores2021 } from "../../db/entities/MatchScores2021";
import { Alliance } from "../../db/entities/types/Alliance";
import { Season } from "../../ftc-api/types/Season";
import { MatchScores2021RemoteGraphql } from "../objects/MatchScores2021RemoteGraphql";
import { MatchScores2021TradGraphql } from "../objects/MatchScores2021TradGraphql";
import { MatchScoresUnion } from "../objects/MatchScoresUnion";
import DataLoader from "dataloader";

@Resolver(Match)
export class MatchResolver {
    // Ugly hack because type-graphql-dataloader can't deal with eager fields.
    @FieldResolver(() => MatchScoresUnion, { nullable: true })
    @Loader<
        { season: Season; eventCode: string; matchId: number },
        MatchScores2021[]
    >(async (ids, _) => {
        let matches = await MatchScores2021.find({
            where: ids as {
                season: Season;
                eventCode: string;
                matchId: number;
            }[],
        });

        let groups: MatchScores2021[][] = ids.map((_) => []);

        for (let m of matches) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (
                    id.season == m.season &&
                    id.eventCode == m.eventCode &&
                    id.matchId == m.matchId
                ) {
                    groups[i].push(m);
                    break;
                }
            }
        }

        return groups;
    })
    async scores(@Root() _match: Match) {
        return async (
            dl: DataLoader<
                { season: Season; eventCode: string; matchId: number },
                MatchScores2021[]
            >
        ) => {
            let scores = await dl.load({
                season: _match.eventSeason,
                eventCode: _match.eventCode,
                matchId: _match.id,
            });

            if (scores && scores.length != 0) {
                switch (scores[0].alliance) {
                    case Alliance.SOLO:
                        return new MatchScores2021RemoteGraphql(scores[0]);
                    case Alliance.RED:
                        return new MatchScores2021TradGraphql(
                            scores[0],
                            scores[1]
                        );
                    case Alliance.BLUE:
                        return new MatchScores2021TradGraphql(
                            scores[1],
                            scores[0]
                        );
                }
            } else {
                return null;
            }
        };
    }
}
