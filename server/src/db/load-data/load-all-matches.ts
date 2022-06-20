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
import {
    TournamentLevel,
    tournamentLevelFromApi,
} from "../entities/types/TournamentLevel";
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
import { MatchScores2021RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Remote";

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

    await FTCSDataSource.transaction(async (em) => {
        // lets do this 25 at a time so we don't get rate limited or run out of memory.
        const chunkSize = 25;
        for (let i = 0; i < eventCodes.length; i += chunkSize) {
            console.log(`Starting chunk starting at ${i}.`);

            const chunk = eventCodes.slice(i, i + chunkSize);
            let chunkEvents = await Promise.all(
                chunk.map(async (ec) => ({
                    eventCode: ec,
                    matches: await getMatches(season, ec),
                    matchScores: await getMatchScores(season, ec),
                }))
            );

            console.log("Fetched from API. Inserting into db.");

            let { dbMatches, dbTeamMatchParticipations } = createDbEntities(
                season,
                chunkEvents
            );

            await em.save(dbMatches, { chunk: 500 });
            await em.save(dbTeamMatchParticipations, { chunk: 500 });

            console.log(`Loaded ${i + chunkSize}/${eventCodes.length}`);
        }

        await em.save(
            FtcApiMetadata.create({
                season,
                lastMatchesReq: dateStartQuery,
            })
        );
    });
}

function createDbEntities(
    season: Season,
    apiEvents: {
        eventCode: string;
        matches: MatchFtcApi[];
        matchScores: MatchScoresFtcApi[];
    }[]
): {
    dbMatches: Match[];
    dbTeamMatchParticipations: TeamMatchParticipation[];
} {
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
                      match.matchNumber,
                      match.teams[0].teamNumber
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

            let thisMatchScores = findMatchScoresForMatchNum(
                adjustedMatchNum,
                matchScores
            );
            if (thisMatchScores) {
                switch (season) {
                    case Season.FREIGHT_FRENZY:
                        if (isMatchScores2021Trad(thisMatchScores)) {
                            dbMatch.scores2021 = MatchScores2021.fromTradApi(
                                season,
                                eventCode,
                                adjustedMatchNum,
                                thisMatchScores
                            );
                        } else if (isMatchScores2021Remote(thisMatchScores)) {
                            dbMatch.scores2021 = [
                                MatchScores2021.fromApiRemote(
                                    season,
                                    eventCode,
                                    adjustedMatchNum,
                                    thisMatchScores
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
                    season: season,
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

    return {
        dbMatches,
        dbTeamMatchParticipations,
    };
}

function findMatchScoresForMatchNum(
    matchNum: number,
    matchScores: MatchScoresFtcApi[]
): MatchScoresFtcApi | undefined {
    for (let ms of matchScores) {
        let isRemote =
            (ms as MatchScores2021RemoteFtcApi).teamNumber != undefined;
        let msMatchNum = isRemote
            ? Match.encodeMatchNumberRemote(
                  (ms as MatchScores2021RemoteFtcApi).matchNumber,
                  (ms as MatchScores2021RemoteFtcApi).teamNumber
              )
            : Match.encodeMatchNumberTraditional(
                  (ms as MatchScores2021TradFtcApi).matchNumber,
                  tournamentLevelFromApi(
                      (ms as MatchScores2021TradFtcApi).matchLevel
                  ),
                  (ms as MatchScores2021TradFtcApi).matchSeries
              );
        if (matchNum == msMatchNum) return ms;
    }
    return undefined;
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
