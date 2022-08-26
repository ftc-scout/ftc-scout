import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { getMatches } from "../../ftc-api/get-matches";
import { Season } from "../../ftc-api/types/Season";
import { DATA_SOURCE } from "../data-source";
import { FtcApiMetadata } from "../entities/FtcApiMetadata";
import { Match } from "../entities/Match";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { tournamentLevelFromApi } from "../entities/types/TournamentLevel";
import { Event } from "../entities/Event";
import { MatchFtcApi } from "../../ftc-api/types/Match";
import { MatchScores2021 } from "../entities/MatchScores2021";
import { getMatchScores } from "../../ftc-api/get-match-scores";
import { MatchScoresFtcApi } from "../../ftc-api/types/match-scores/MatchScores";
import { MatchScores2021TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Trad";
import { MatchScores2021RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Remote";
import { TeamEventParticipation2021 } from "../entities/team-event-participation/TeamEventParticipation2021";
import { getTeamsAtEvent } from "../../ftc-api/get-teams";
import { calculateEventStatistics2021 } from "../../logic/calculate-event-statistics2021";
import { MatchScores2019 } from "../entities/MatchScores2019";
import { MatchScores2019FtcApi } from "../../ftc-api/types/match-scores/MatchScores2019";
import { calculateEventStatistics2019 } from "../../logic/calculate-event-statistics2019";
import { TeamEventParticipation2019 } from "../entities/team-event-participation/TeamEventParticipation2019";

function addDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export async function loadAllMatches(season: Season) {
    console.log(`Loading all matches from season ${season}.`);

    if (season != Season.FREIGHT_FRENZY && season != Season.SKYSTONE)
        throw `Cannot load match scores for season ${season}`;

    let dateStartQuery = new Date();
    let dateLastReq = await FtcApiMetadata.getLastMatchesReq(season);

    console.log("Getting event codes.");

    let eventCodes = await getEventCodesToLoadMatchesFrom(season, dateStartQuery, dateLastReq);

    console.log("Loading matches from api.");

    await DATA_SOURCE.transaction(async (em) => {
        // lets do this 25 at a time so we don't get rate limited or run out of memory.
        const chunkSize = 25;
        for (let i = 0; i < eventCodes.length; i += chunkSize) {
            console.log(`Starting chunk starting at ${i}.`);
            console.log("Fetching from api.");

            const chunk = eventCodes.slice(i, i + chunkSize);
            let chunkEvents = await Promise.all(
                chunk.map(async (ec) => ({
                    eventCode: ec.code,
                    remote: ec.remote,
                    matches: await getMatches(season, ec.code),
                    matchScores: await getMatchScores(season, ec.code),
                    teams: await getTeamsAtEvent(season, ec.code),
                }))
            );

            console.log("Calculating.");

            let { dbMatches, dbTeamMatchParticipations, dbTeamEventParticipations2021, dbTeamEventParticipations2019 } =
                createDbEntities(season, chunkEvents);

            console.log("Inserting into db.");

            await em.save(dbMatches, { chunk: 500 });
            await em.save(
                dbMatches.flatMap((m) => m.scores2019 ?? []),
                { chunk: 500 }
            );
            await em.save(
                dbMatches.flatMap((m) => m.scores2021 ?? []),
                { chunk: 500 }
            );
            await em.save(dbTeamMatchParticipations, { chunk: 500 });
            await em.save(dbTeamEventParticipations2021, { chunk: 100 }); // These are really big so lower chunk size
            await em.save(dbTeamEventParticipations2019, { chunk: 100 });

            console.log(`Loaded ${i + chunkSize}/${eventCodes.length}`);
        }

        await em.save(
            FtcApiMetadata.create({
                season,
                lastMatchesReq: dateStartQuery,
            })
        );

        console.log("Done inserting matches.");
    });
}

function createDbEntities(
    season: Season,
    apiEvents: {
        eventCode: string;
        remote: boolean;
        matches: MatchFtcApi[];
        matchScores: MatchScoresFtcApi[];
        teams: number[];
    }[]
): {
    dbMatches: Match[];
    dbTeamMatchParticipations: TeamMatchParticipation[];
    dbTeamEventParticipations2021: TeamEventParticipation2021[];
    dbTeamEventParticipations2019: TeamEventParticipation2019[];
} {
    let dbMatchesAll: Match[] = [];
    let dbTeamMatchParticipationsAll: TeamMatchParticipation[] = [];
    let dbTeamEventParticipations2021All: TeamEventParticipation2021[] = [];
    let dbTeamEventParticipations2019All: TeamEventParticipation2019[] = [];

    for (let { eventCode, remote, matches, matchScores, teams } of apiEvents) {
        let dbMatches: Match[] = [];
        let dbTeamMatchParticipations: TeamMatchParticipation[] = [];

        for (let match of matches) {
            let thisMatchScores = findMatchScoresForMatchNum(
                remote
                    ? Match.encodeMatchIdRemote(match.matchNumber, match.teams[0].teamNumber)
                    : Match.encodeMatchIdTraditional(
                          match.matchNumber,
                          tournamentLevelFromApi(match.tournamentLevel),
                          match.series
                      ),
                matchScores
            );

            let hasBeenPlayed = !!match.postResultTime || !!thisMatchScores;

            let dbMatch: Match | null = Match.fromApi(season, eventCode, match, remote, hasBeenPlayed);

            if (thisMatchScores) {
                if (season == Season.FREIGHT_FRENZY && !remote) {
                    dbMatch.scores2021 = MatchScores2021.fromTradApi(
                        season,
                        eventCode,
                        dbMatch.id,
                        thisMatchScores as MatchScores2021TradFtcApi
                    );
                } else if (season == Season.FREIGHT_FRENZY && remote) {
                    dbMatch.scores2021 = [
                        MatchScores2021.fromApiRemote(
                            season,
                            eventCode,
                            dbMatch.id,
                            thisMatchScores as MatchScores2021RemoteFtcApi
                        ),
                    ];
                } else if (season == Season.SKYSTONE) {
                    dbMatch.scores2019 = MatchScores2019.fromApi(
                        season,
                        eventCode,
                        dbMatch.id,
                        thisMatchScores as MatchScores2019FtcApi
                    );
                } else {
                    throw `Cannot load match scores for season ${season}`;
                }
            }

            dbMatch.teams = [];

            for (let team of match.teams) {
                if (!team.teamNumber) continue;

                let dbTeamMatchParticipation = TeamMatchParticipation.fromApi(season, eventCode, dbMatch.id, team);

                if (remote && dbTeamMatchParticipation.noShow) {
                    dbMatch = null;
                    break;
                }

                dbTeamMatchParticipations.push(dbTeamMatchParticipation);
                dbMatch.teams.push(dbTeamMatchParticipation);
            }

            if (dbMatch != null) {
                dbMatches.push(dbMatch);
            }
        }

        if (season == Season.FREIGHT_FRENZY) {
            dbTeamEventParticipations2021All.push(
                ...calculateEventStatistics2021(season, eventCode, teams, dbMatches, remote)
            );
        } else if (season == Season.SKYSTONE) {
            dbTeamEventParticipations2019All.push(...calculateEventStatistics2019(season, eventCode, teams, dbMatches));
        } else {
            throw `Cannot load match scores for season ${season}`;
        }

        dbMatchesAll.push(...dbMatches);
        dbTeamMatchParticipationsAll.push(...dbTeamMatchParticipations);
    }

    return {
        dbMatches: dbMatchesAll,
        dbTeamMatchParticipations: dbTeamMatchParticipationsAll,
        dbTeamEventParticipations2021: dbTeamEventParticipations2021All,
        dbTeamEventParticipations2019: dbTeamEventParticipations2019All,
    };
}

function findMatchScoresForMatchNum(matchId: number, matchScores: MatchScoresFtcApi[]): MatchScoresFtcApi | undefined {
    for (let ms of matchScores) {
        let isRemote = (ms as MatchScores2021RemoteFtcApi).teamNumber != undefined;
        let msMatchId = isRemote
            ? Match.encodeMatchIdRemote(
                  (ms as MatchScores2021RemoteFtcApi).matchNumber,
                  (ms as MatchScores2021RemoteFtcApi).teamNumber
              )
            : Match.encodeMatchIdTraditional(
                  (ms as MatchScores2021TradFtcApi).matchNumber,
                  tournamentLevelFromApi((ms as MatchScores2021TradFtcApi).matchLevel),
                  (ms as MatchScores2021TradFtcApi).matchSeries
              );
        if (matchId == msMatchId) return ms;
    }
    return undefined;
}

async function getEventCodesToLoadMatchesFrom(
    season: Season,
    dateStartQuery: Date,
    dateLastReq: Date | null
): Promise<{ code: string; remote: boolean }[]> {
    let events = !dateLastReq
        ? await Event.findBy({ season }) // Get all events because we haven't made a request yet.
        : await Event.find({
              select: {
                  code: true,
                  remote: true,
              },
              where: [
                  // Get events that were ongoing anytime between the last query and now
                  {
                      season,
                      start: LessThanOrEqual(dateStartQuery),
                      end: MoreThanOrEqual(addDays(dateLastReq, -1)), // with a little extra leeway.
                      published: true,
                  },
                  // Or that were updated since the last request.
                  {
                      season,
                      updatedAt: Between(dateLastReq, dateStartQuery),
                      published: true,
                  },
              ],
          });
    return events;
}
