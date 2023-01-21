import { Brackets, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
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
import { MatchScores2020 } from "../entities/MatchScores2020";
import { MatchScores2020TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Trad";
import { MatchScores2020RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Remote";
import { calculateEventStatistics2020 } from "../../logic/calculate-event-statistics2020";
import { TeamEventParticipation2020 } from "../entities/team-event-participation/TeamEventParticipation2020";
import { MatchScores2022 } from "../entities/MatchScores2022";
import { MatchScores2022TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2022Trad";
import { calculateEventStatistics2022 } from "../../logic/calculate-event-statistics2022";
import { TeamEventParticipation2022 } from "../entities/team-event-participation/TeamEventParticipation2022";
import { MINS_PER_HOUR } from "../../constants";

export async function loadAllMatches(season: Season, cycleCount: number = 0) {
    console.log(`Loading matches from season ${season}.`);

    let dateStartQuery = new Date();
    let dateLastReq = await FtcApiMetadata.getLastMatchesReq(season);

    console.log("Getting event codes.");

    let eventCodes = await getEventCodesToLoadMatchesFrom(season, dateStartQuery, dateLastReq, cycleCount);

    console.log("Loading matches from api.");

    // lets do this 25 at a time so we don't get rate limited or run out of memory.
    for (let i = 0; i < eventCodes.length; i += 1) {
        try {
            console.log(`Starting chunk starting at ${i}.`);
            console.log("Fetching from api.");

            let ec = eventCodes[i];
            let event = {
                eventCode: ec.code,
                remote: ec.remote,
                matches: await getMatches(season, ec.code),
                matchScores: await getMatchScores(season, ec.code),
                teams: await getTeamsAtEvent(season, ec.code),
            };
            console.log("Calculating.");

            let {
                dbMatches,
                dbTeamMatchParticipations,
                dbTeamEventParticipations2022,
                dbTeamEventParticipations2021,
                dbTeamEventParticipations2020,
                dbTeamEventParticipations2019,
            } = createDbEntities(season, event);

            console.log("Inserting into db.");

            await DATA_SOURCE.transaction(async (em) => {
                await em.save(dbMatches, { chunk: 500 });
                await em.save(
                    dbMatches.flatMap((m) => m.scores2019 ?? []),
                    { chunk: 500 }
                );
                await em.save(
                    dbMatches.flatMap((m) => m.scores2020 ?? []),
                    { chunk: 500 }
                );
                await em.save(
                    dbMatches.flatMap((m) => m.scores2021 ?? []),
                    { chunk: 500 }
                );
                await em.save(
                    dbMatches.flatMap((m) => m.scores2022 ?? []),
                    { chunk: 500 }
                );

                await em.save(dbTeamMatchParticipations, { chunk: 500 });
                await em.save(dbTeamEventParticipations2022, { chunk: 100 }); // These are really big so lower chunk size
                await em.save(dbTeamEventParticipations2021, { chunk: 100 });
                await em.save(dbTeamEventParticipations2020, { chunk: 100 });
                await em.save(dbTeamEventParticipations2019, { chunk: 100 });
            });

            console.log(`Loaded ${i}/${eventCodes.length}`);
        } catch (e) {
            console.log(`Loaded ${i}/${eventCodes.length} !!! ERROR !!!`);
        }
    }

    await FtcApiMetadata.save({
        season,
        lastMatchesReq: dateStartQuery,
    });

    console.log("Done inserting matches.");
}

function createDbEntities(
    season: Season,
    apiEvent: {
        eventCode: string;
        remote: boolean;
        matches: MatchFtcApi[];
        matchScores: MatchScoresFtcApi[];
        teams: number[];
    }
): {
    dbMatches: Match[];
    dbTeamMatchParticipations: TeamMatchParticipation[];
    dbTeamEventParticipations2022: TeamEventParticipation2022[];
    dbTeamEventParticipations2021: TeamEventParticipation2021[];
    dbTeamEventParticipations2020: TeamEventParticipation2020[];
    dbTeamEventParticipations2019: TeamEventParticipation2019[];
} {
    let dbMatchesAll: Match[] = [];
    let dbTeamMatchParticipationsAll: TeamMatchParticipation[] = [];
    let dbTeamEventParticipations2022All: TeamEventParticipation2022[] = [];
    let dbTeamEventParticipations2021All: TeamEventParticipation2021[] = [];
    let dbTeamEventParticipations2020All: TeamEventParticipation2020[] = [];
    let dbTeamEventParticipations2019All: TeamEventParticipation2019[] = [];

    let { eventCode, remote, matches, matchScores, teams } = apiEvent;
    let dbMatches: Match[] = [];
    let dbTeamMatchParticipations: TeamMatchParticipation[] = [];

    for (let match of matches) {
        // Ignore some incorrect matches
        if (
            season == Season.ULTIMATE_GOAL &&
            eventCode == "USNYEXS1" &&
            match.teams.some((t) => t.teamNumber == 14903 || t.teamNumber == 17222)
        ) {
            continue;
        }
        if (
            season == Season.ULTIMATE_GOAL &&
            eventCode == "USNJCWS1" &&
            match.teams.some((t) => t.teamNumber == 9889)
        ) {
            continue;
        }

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
            if (season == Season.POWER_PLAY) {
                dbMatch.scores2022 = MatchScores2022.fromTradApi(
                    season,
                    eventCode,
                    dbMatch.id,
                    thisMatchScores as MatchScores2022TradFtcApi
                );
            } else if (season == Season.FREIGHT_FRENZY && !remote) {
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
            } else if (season == Season.ULTIMATE_GOAL && !remote) {
                dbMatch.scores2020 = MatchScores2020.fromTradApi(
                    season,
                    eventCode,
                    dbMatch.id,
                    thisMatchScores as MatchScores2020TradFtcApi
                );
            } else if (season == Season.ULTIMATE_GOAL && remote) {
                dbMatch.scores2020 = [
                    MatchScores2020.fromApiRemote(
                        season,
                        eventCode,
                        dbMatch.id,
                        thisMatchScores as MatchScores2020RemoteFtcApi
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

    if (season == Season.POWER_PLAY) {
        dbTeamEventParticipations2022All.push(...calculateEventStatistics2022(season, eventCode, teams, dbMatches));
    } else if (season == Season.FREIGHT_FRENZY) {
        dbTeamEventParticipations2021All.push(
            ...calculateEventStatistics2021(season, eventCode, teams, dbMatches, remote)
        );
    } else if (season == Season.ULTIMATE_GOAL) {
        dbTeamEventParticipations2020All.push(
            ...calculateEventStatistics2020(season, eventCode, teams, dbMatches, remote)
        );
    } else if (season == Season.SKYSTONE) {
        dbTeamEventParticipations2019All.push(...calculateEventStatistics2019(season, eventCode, teams, dbMatches));
    } else {
        throw `Cannot load match scores for season ${season}`;
    }

    dbMatchesAll.push(...dbMatches);
    dbTeamMatchParticipationsAll.push(...dbTeamMatchParticipations);

    return {
        dbMatches: dbMatchesAll,
        dbTeamMatchParticipations: dbTeamMatchParticipationsAll,
        dbTeamEventParticipations2022: dbTeamEventParticipations2022All,
        dbTeamEventParticipations2021: dbTeamEventParticipations2021All,
        dbTeamEventParticipations2020: dbTeamEventParticipations2020All,
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
    dateLastReq: Date | null,
    cycleCount: number
): Promise<{ code: string; remote: boolean }[]> {
    if (!dateLastReq) {
        // Get all events because we haven't made a request yet.
        return Event.findBy({ season });
    }

    if (cycleCount % (MINS_PER_HOUR * 12) == 0) {
        console.log("0 type");
        // Gets events with no matches or missing matches.
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder("e")
            .where("season = :season", { season })
            .andWhere("start < now()")
            .andWhere("start > 'now'::timestamp - '1 month'::interval")
            .andWhere(
                new Brackets((qb) => {
                    qb.where('NOT exists(SELECT FROM match WHERE season = :season AND "eventCode" = code)')
                        .orWhere(`exists(SELECT
                        FROM match m
                        WHERE season = :season
                          AND "eventCode" = code
                          AND NOT exists(SELECT
                                         FROM match_scores${season} s
                                         WHERE s.season = m."eventSeason"
                                           AND s."eventCode" = m."eventCode"
                                           AND s."matchId" = m.id))`);
                })
            )
            .getMany();
    } else {
        console.log("1 type");
        // Get events that are scheduled for right now now
        let events = await Event.find({
            select: {
                code: true,
                remote: true,
            },
            where: {
                season,
                start: LessThanOrEqual(dateStartQuery),
                end: MoreThanOrEqual(dateStartQuery),
            },
        });
        let duplicateCodes = events.map((e) => e.code);
        let uniqueCodes = [...new Set(duplicateCodes)];
        return uniqueCodes.map((code) => ({
            code,
            remote: events.find((e) => e.code == code)!.remote,
        }));
    }
}
