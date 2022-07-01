import { DeepPartial } from "typeorm";
import { Match } from "../db/entities/Match";
import { TeamEventParticipation } from "../db/entities/TeamEventParticipation";
import { TeamMatchParticipation } from "../db/entities/TeamMatchParticipation";
import { stationIsBlue, stationIsRed } from "../db/entities/types/Station";
import { TournamentLevel } from "../db/entities/types/TournamentLevel";
import { Season } from "../ftc-api/types/Season";
import { calculateOPR } from "./calculate-opr";

export function calculateEventStatistics(
    eventSeason: Season,
    eventCode: string,
    teams: number[],
    matches: Match[],
    tmps: TeamMatchParticipation[],
    isRemote: boolean
): TeamEventParticipation[] {
    let participations: Record<number, TeamEventParticipation> = {};

    teams.forEach(
        (t) =>
            (participations[t] = TeamEventParticipation.create({
                eventSeason,
                eventCode,
                teamNumber: t,
            } as DeepPartial<TeamEventParticipation>))
    );

    if (!isRemote) {
        tmps.forEach((tmp) => {
            participations[tmp.teamNumber].wins = 0;
            participations[tmp.teamNumber].losses = 0;
            participations[tmp.teamNumber].ties = 0;
            participations[tmp.teamNumber].dq = 0;
            participations[tmp.teamNumber].matchesPlayed = 0;
            participations[tmp.teamNumber].qualMatchesPlayed = 0;
            participations[tmp.teamNumber].qualPoints = 0;
        });

        for (let match of matches) {
            if (!match.hasBeenPlayed) continue;

            if (match.tournamentLevel == TournamentLevel.QUALS) {
                if (match.redTotalPoints()! > match.blueTotalPoints()!) {
                    getRedTeams(tmps, match.id).forEach(
                        (t) => participations[t].wins!++
                    );
                    getBlueTeams(tmps, match.id).forEach(
                        (t) => participations[t].losses!++
                    );
                } else if (match.blueTotalPoints()! > match.redTotalPoints()!) {
                    getBlueTeams(tmps, match.id).forEach(
                        (t) => participations[t].wins!++
                    );
                    getRedTeams(tmps, match.id).forEach(
                        (t) => participations[t].losses!++
                    );
                } else {
                    getMatchTeams(tmps, match.id).forEach(
                        (t) => participations[t.teamNumber].ties!++
                    );
                }
            }

            getMatchTeams(tmps, match.id).forEach((t) => {
                participations[t.teamNumber].matchesPlayed!++;
                if (match.tournamentLevel == TournamentLevel.QUALS) {
                    participations[t.teamNumber].qualMatchesPlayed!++;
                    if (stationIsRed(t.station)) {
                        participations[t.teamNumber].qualPoints! +=
                            match.redTotalPoints()!;
                    } else {
                        participations[t.teamNumber].qualPoints! +=
                            match.blueTotalPoints()!;
                    }
                }
                if (t.dq) {
                    participations[t.teamNumber].dq!++;
                }
            });
        }

        let teamsWithMatches = getTeams(tmps);

        teamsWithMatches.forEach((t) => {
            participations[t].qualAverage =
                participations[t].qualMatchesPlayed == 0
                    ? null
                    : participations[t].qualPoints! /
                      participations[t].qualMatchesPlayed!;
        });

        let oprRecords = matches.flatMap((match) => {
            if (!match.hasBeenPlayed) return [];
            // if (match.tournamentLevel != TournamentLevel.QUALS) return []; // Maybe?

            let [rTeam1, rTeam2] = getRedTeams(tmps, match.id);
            let [bTeam1, bTeam2] = getBlueTeams(tmps, match.id);

            // Sometimes there is only one alliance for some reason?
            let records = [];
            if (rTeam1 && rTeam2) {
                records.push({
                    team1: rTeam1,
                    team2: rTeam2,
                    result: match.redTotalPoints()!,
                });
            }
            if (bTeam1 && bTeam2) {
                records.push({
                    team1: bTeam1,
                    team2: bTeam2,
                    result: match.blueTotalPoints()!,
                });
            }
            return records;
        });

        let oprs = calculateOPR(oprRecords);

        Object.entries(oprs).forEach(([teamNumber, opr]) => {
            try {
                participations[+teamNumber].opr = opr;
            } catch (err) {
                console.log(teamNumber, opr);
                throw err;
            }
        });
    } else {
        tmps.forEach((tmp) => {
            participations[tmp.teamNumber].qualPoints = 0;
            participations[tmp.teamNumber].dq = 0;
            participations[tmp.teamNumber].qualMatchesPlayed = 0;
            participations[tmp.teamNumber].matchesPlayed = 0;
        });

        tmps.forEach((tmp) => {
            let match = getMatch(matches, tmp);

            if (!match.hasBeenPlayed) return;

            participations[tmp.teamNumber].qualPoints! += match.soloPoints()!;
            participations[tmp.teamNumber].qualMatchesPlayed!++;
            participations[tmp.teamNumber].matchesPlayed!++;
            if (tmp.dq) {
                participations[tmp.teamNumber].dq!++;
            }
            participations[tmp.teamNumber].matchesPlayed!++;
        });

        let teamsWithMatches = getTeams(tmps);

        teamsWithMatches.forEach((t) => {
            participations[t].qualAverage =
                participations[t].qualMatchesPlayed == 0
                    ? null
                    : participations[t].qualPoints! /
                      participations[t].qualMatchesPlayed!;
            participations[t].opr = participations[t].qualAverage;
        });
    }

    let rankedTeams = Object.entries(participations)
        .filter(([_, v]) => !!v.qualPoints)
        .map(([k, v]) => [+k, v.qualPoints!] as const)
        .sort(([_ka, a], [_kb, b]) => b - a);
    for (let rank = 0; rank < rankedTeams.length; rank++) {
        participations[rankedTeams[rank][0]].rank = rank + 1;
    }

    return Object.values(participations);
}

function getRedTeams(tmps: TeamMatchParticipation[], id: number): number[] {
    return tmps
        .filter(
            (tmp) =>
                tmp.matchId == id && stationIsRed(tmp.station) && tmp.onField
        )
        .map((tmp) => tmp.teamNumber);
}

function getBlueTeams(tmps: TeamMatchParticipation[], id: number): number[] {
    return tmps
        .filter(
            (tmp) =>
                tmp.matchId == id && stationIsBlue(tmp.station) && tmp.onField
        )
        .map((tmp) => tmp.teamNumber);
}

function getMatchTeams(
    tmps: TeamMatchParticipation[],
    id: number
): TeamMatchParticipation[] {
    return tmps.filter((tmp) => tmp.matchId == id);
}

function getTeams(tmps: TeamMatchParticipation[]): number[] {
    return [...new Set(tmps.map((tmp) => tmp.teamNumber))];
}

function getMatch(matches: Match[], tmp: TeamMatchParticipation): Match {
    for (let match of matches) {
        if (match.id == tmp.matchId) return match;
    }

    throw "No match for team match participation";
}
