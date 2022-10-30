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
import { MatchScores2019Graphql } from "../objects/MatchScores2019Graphql";
import { MatchScores2019 } from "../../db/entities/MatchScores2019";
import { MatchScores2020 } from "../../db/entities/MatchScores2020";
import { MatchScores2020RemoteGraphql } from "../objects/MatchScores2020RemoteGraphql";
import { MatchScores2020TradGraphql } from "../objects/MatchScores2020TradGraphql";
import { MatchScores2022 } from "../../db/entities/MatchScores2022";
import { MatchScores2022Graphql } from "../objects/MatchScores2022Graphql";

@Resolver(Match)
export class MatchResolver {
    // Ugly hack because type-graphql-dataloader can't deal with eager fields.
    @FieldResolver(() => MatchScoresUnion, { nullable: true })
    @Loader<
        { season: Season; eventCode: string; matchId: number },
        (MatchScores2022 | MatchScores2021 | MatchScores2020 | MatchScores2019)[]
    >(async (ids, _) => {
        let ids2022 = ids.filter((id) => id.season == 2022);
        let ids2021 = ids.filter((id) => id.season == 2021);
        let ids2020 = ids.filter((id) => id.season == 2020);
        let ids2019 = ids.filter((id) => id.season == 2019);

        let scores2022P = ids2022.length
            ? await MatchScores2022.find({
                  where: ids2022 as {
                      season: Season;
                      eventCode: string;
                      matchId: number;
                  }[],
              })
            : [];
        let scores2021P = ids2021.length
            ? await MatchScores2021.find({
                  where: ids2021 as {
                      season: Season;
                      eventCode: string;
                      matchId: number;
                  }[],
              })
            : [];
        let scores2020P = ids2020.length
            ? await MatchScores2020.find({
                  where: ids2020 as {
                      season: Season;
                      eventCode: string;
                      matchId: number;
                  }[],
              })
            : [];
        let scores2019P = ids2019.length
            ? await MatchScores2019.find({
                  where: ids2019 as {
                      season: Season;
                      eventCode: string;
                      matchId: number;
                  }[],
              })
            : [];

        let [scores2022, scores2021, scores2020, scores2019] = await Promise.all([
            scores2022P,
            scores2021P,
            scores2020P,
            scores2019P,
        ]);
        let scores = [...scores2022, ...scores2021, ...scores2020, ...scores2019];

        let groups: (MatchScores2022 | MatchScores2021 | MatchScores2020 | MatchScores2019)[][] = ids.map((_) => []);

        for (let s of scores) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == s.season && id.eventCode == s.eventCode && id.matchId == s.matchId) {
                    groups[i].push(s);
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
                (MatchScores2022 | MatchScores2021 | MatchScores2020 | MatchScores2019)[]
            >
        ) => {
            let scores = await dl.load({
                season: _match.eventSeason,
                eventCode: _match.eventCode,
                matchId: _match.id,
            });

            if (scores && scores.length != 0) {
                if (_match.eventSeason == Season.POWER_PLAY) {
                    switch (scores[0].alliance) {
                        case Alliance.RED:
                            return new MatchScores2022Graphql(
                                scores[0] as MatchScores2022,
                                scores[1] as MatchScores2022
                            );
                        case Alliance.BLUE:
                            return new MatchScores2022Graphql(
                                scores[1] as MatchScores2022,
                                scores[0] as MatchScores2022
                            );
                        case Alliance.SOLO:
                            throw "Impossible solo alliance in 2022";
                    }
                } else if (_match.eventSeason == Season.FREIGHT_FRENZY) {
                    switch (scores[0].alliance) {
                        case Alliance.SOLO:
                            return new MatchScores2021RemoteGraphql(scores[0] as MatchScores2021);
                        case Alliance.RED:
                            return new MatchScores2021TradGraphql(
                                scores[0] as MatchScores2021,
                                scores[1] as MatchScores2021
                            );
                        case Alliance.BLUE:
                            return new MatchScores2021TradGraphql(
                                scores[1] as MatchScores2021,
                                scores[0] as MatchScores2021
                            );
                    }
                } else if (_match.eventSeason == Season.ULTIMATE_GOAL) {
                    switch (scores[0].alliance) {
                        case Alliance.SOLO:
                            return new MatchScores2020RemoteGraphql(scores[0] as MatchScores2020);
                        case Alliance.RED:
                            return new MatchScores2020TradGraphql(
                                scores[0] as MatchScores2020,
                                scores[1] as MatchScores2020
                            );
                        case Alliance.BLUE:
                            return new MatchScores2020TradGraphql(
                                scores[1] as MatchScores2020,
                                scores[0] as MatchScores2020
                            );
                    }
                } else if (_match.eventSeason == Season.SKYSTONE) {
                    switch (scores[0].alliance) {
                        case Alliance.RED:
                            return new MatchScores2019Graphql(
                                scores[0] as MatchScores2019,
                                scores[1] as MatchScores2019
                            );
                        case Alliance.BLUE:
                            return new MatchScores2019Graphql(
                                scores[1] as MatchScores2019,
                                scores[0] as MatchScores2019
                            );
                        case Alliance.SOLO:
                            throw "Impossible solo alliance in 2019";
                    }
                } else {
                    throw `Can't construct match scores for season ${_match.eventSeason}.`;
                }
            } else {
                return null;
            }
        };
    }
}
