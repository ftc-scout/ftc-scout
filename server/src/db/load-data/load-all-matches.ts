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
import { TeamEventParticipation } from "../entities/TeamEventParticipation";
import { getTeamsAtEvent } from "../../ftc-api/get-teams";
import { calculateEventStatistics } from "../../logic/calculate-event-statistics";

function addDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export async function loadAllMatches(season: Season) {
    console.log(`Loading all matches from season ${season}.`);

    if (season != Season.FREIGHT_FRENZY) throw `Cannot load match scores for season ${season}`;

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

            let { dbMatches, dbTeamMatchParticipations, dbTeamEventParticipations } = createDbEntities(
                season,
                chunkEvents
            );

            console.log("Inserting into db.");

            await em.save(dbMatches, { chunk: 500 });
            await em.save(dbTeamMatchParticipations, { chunk: 500 });
            await em.save(dbTeamEventParticipations, { chunk: 500 });

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
    dbTeamEventParticipations: TeamEventParticipation[];
} {
    let dbMatchesAll: Match[] = [];
    let dbTeamMatchParticipationsAll: TeamMatchParticipation[] = [];
    let dbTeamEventParticipationsAll: TeamEventParticipation[] = [];

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

            let dbMatch = Match.fromApi(season, eventCode, match, remote, hasBeenPlayed);

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
                } else {
                    throw `Cannot load match scores for season ${season}`;
                }
            }
            dbMatches.push(dbMatch);

            for (let team of match.teams) {
                if (!team.teamNumber) continue;

                let dbTeamMatchParticipation = TeamMatchParticipation.fromApi(season, eventCode, dbMatch.id, team);
                dbTeamMatchParticipations.push(dbTeamMatchParticipation);
            }
        }

        let dbTeamEventParticipations = calculateEventStatistics(
            season,
            eventCode,
            teams,
            dbMatches,
            dbTeamMatchParticipations,
            remote
        );

        if (dbTeamEventParticipations.some((tep) => tep.opr != null && isNaN(tep.opr))) {
            // console.log(eventCode, remote, matches, matchScores, teams);
            console.log(dbTeamEventParticipations);
            throw "No!";
        }

        dbMatchesAll.push(...dbMatches);
        dbTeamMatchParticipationsAll.push(...dbTeamMatchParticipations);
        dbTeamEventParticipationsAll.push(...dbTeamEventParticipations);
    }

    return {
        dbMatches: dbMatchesAll,
        dbTeamMatchParticipations: dbTeamMatchParticipationsAll,
        dbTeamEventParticipations: dbTeamEventParticipationsAll,
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
