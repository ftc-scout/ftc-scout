import {
    Between,
    DeepPartial,
    EntityManager,
    LessThanOrEqual,
    MoreThanOrEqual,
    Raw,
} from "typeorm";
import { getMatches } from "../../ftc-api/get-matches";
import { Season } from "../../ftc-api/types/Season";
import { FTCSDataSource } from "../data-source";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { Match } from "../entities/Match";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { Station } from "../entities/types/Station";
import { TournamentLevel } from "../entities/types/TournamentLevel";
import { Event } from "../entities/Event";
import { MatchFtcApi } from "../../ftc-api/types/Match";
import { MatchScores2021 } from "../entities/MatchScores2021";
import { getMatchScores } from "../../ftc-api/get-match-scores";
import {
    isMatchScores2021Remote,
    isMatchScores2021Trad,
    MatchScoresFtcApi,
} from "../../ftc-api/types/match-scores/MatchScores";
import { MatchScores2021TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Trad";

function addDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export async function loadAllMatches(season: Season) {
    console.log(`Loading all matches from season ${season}.`);

    if (season != Season.FREIGHT_FRENZY)
        throw `Cannot load match scores for season ${season}`;

    let dateStartQuery = new Date();
    let dateLastReq = await FtcApiMetadata.getLastMatchesReq(season);

    console.log("Getting event codes.");

    let eventCodes = await getEventCodesToLoadMatchesFrom(
        season,
        dateStartQuery,
        dateLastReq
    );

    console.log("Loading matches from api.");

    let apiEvents: {
        eventCode: string;
        matches: MatchFtcApi[];
        matchScores: MatchScoresFtcApi[];
    }[] = [];
    // lets do this 50 at a time so we don't get rate limited.
    const chunkSize = 50;
    for (let i = 0; i < eventCodes.length; i += chunkSize) {
        const chunk = eventCodes.slice(i, i + chunkSize);
        let chunkEvents = await Promise.all(
            chunk.map(async (ec) => ({
                eventCode: ec,
                matches: await getMatches(season, ec),
                matchScores: await getMatchScores(season, ec),
            }))
        );
        apiEvents.push(...chunkEvents);
        console.log(`Loaded ${i + chunkSize}/${eventCodes.length}`);
    }

    let dbMatches: Match[] = [];
    let dbTeamMatchParticipations: TeamMatchParticipation[] = [];

    for (let { eventCode, matches, matchScores } of apiEvents) {
        for (let match of matches) {
            let tournamentLevel = {
                QUALIFICATION: TournamentLevel.QUALS,
                SEMIFINAL: TournamentLevel.SEMIS,
                FINAL: TournamentLevel.FINALS,
                OTHER: TournamentLevel.QUALS, // No idea what these are
                PLAYOFF: TournamentLevel.FINALS, // ???
            }[match.tournamentLevel]!;
            let isRemote = match.teams.length == 1;
            let adjustedMatchNum = isRemote
                ? Match.encodeMatchNumberRemote(
                      match.teams[0].teamNumber,
                      match.matchNumber
                  )
                : Match.encodeMatchNumberTraditional(
                      match.matchNumber,
                      tournamentLevel,
                      match.series
                  );
            let dbMatch = Match.create({
                eventSeason: season,
                eventCode,
                num: adjustedMatchNum,
                hasBeenPlayed: !!match.postResultTime,
                scheduledStartTime: match.startTime,
                actualStartTime: match.actualStartTime,
                postResultTime: match.postResultTime,
                tournamentLevel,
                series: match.series,
            } as DeepPartial<Match>);

            if (matchScores.length) {
                switch (season) {
                    case Season.FREIGHT_FRENZY:
                        if (isMatchScores2021Trad(matchScores[0])) {
                            dbMatch.scores2021 = (
                                matchScores as MatchScores2021TradFtcApi[]
                            ).flatMap((ms) =>
                                MatchScores2021.fromTradApi(
                                    season,
                                    eventCode,
                                    adjustedMatchNum,
                                    ms
                                )
                            );
                        } else if (isMatchScores2021Remote(matchScores[0])) {
                            dbMatch.scores2021 = [
                                MatchScores2021.fromApiRemote(
                                    season,
                                    eventCode,
                                    adjustedMatchNum,
                                    matchScores[0]
                                ),
                            ];
                        }
                        break;
                    default:
                        throw `Cannot load match scores for season ${season}`;
                }
            }
            dbMatches.push(dbMatch);

            for (let team of match.teams) {
                if (!team.teamNumber) continue;

                let dbTeamMatchParticipation = TeamMatchParticipation.create({
                    eventSeason: season,
                    eventCode,
                    matchNum: adjustedMatchNum,
                    teamNumber: team.teamNumber,
                    station: {
                        Red1: Station.RED_1,
                        Red2: Station.RED_2,
                        Red3: Station.RED_3,
                        Blue1: Station.BLUE_1,
                        Blue2: Station.BLUE_2,
                        Blue3: Station.BLUE_3,
                        1: Station.SOLO,
                    }[team.station],
                    surrogate: team.surrogate,
                    noShow: team.noShow,
                    dq: team.dq,
                    onField: team.onField,
                } as DeepPartial<TeamMatchParticipation>);
                dbTeamMatchParticipations.push(dbTeamMatchParticipation);
            }
        }
    }

    console.log("Inserting into database.");

    await FTCSDataSource.transaction(async (em) => {
        await chunkedSave(em, dbMatches, 1000);
        await chunkedSave(em, dbTeamMatchParticipations, 1000);
        await em.save(
            FtcApiMetadata.create({
                season,
                lastMatchesReq: dateStartQuery,
            })
        );
    });
}

async function chunkedSave<T>(
    em: EntityManager,
    items: T[],
    chunkSize: number
) {
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        await em.save(chunk);
        console.log(`Loaded ${i + chunkSize}/${items.length}`);
    }
}

async function getEventCodesToLoadMatchesFrom(
    season: Season,
    dateStartQuery: Date,
    dateLastReq: Date | null
): Promise<string[]> {
    let events = !dateLastReq
        ? await Event.findBy({ season }) // Get all events because we haven't made a request yet.
        : await Event.find({
              select: {
                  code: true,
              },
              where: [
                  // Get events that were ongoing anytime between the last query and now
                  {
                      season,
                      start: LessThanOrEqual(dateStartQuery),
                      end: MoreThanOrEqual(addDays(dateLastReq, -1)), // with a little extra leeway.
                  },
                  // Or that don't have any matches and are in the future or within the last week
                  {
                      season,
                      code: Raw(
                          (a) =>
                              `${a} NOT IN (SELECT "eventCode" FROM match WHERE season=:season)`,
                          { season }
                      ),
                      start: MoreThanOrEqual(addDays(dateStartQuery, -7)),
                  },
                  // Or that was created since the last request.
                  {
                      season,
                      createdAt: Between(dateLastReq, dateStartQuery),
                  },
              ],
          });
    return events.map((e) => e.code);
}
