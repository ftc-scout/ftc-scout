import {
    Alliance,
    DESCRIPTORS,
    Descriptor,
    EventType,
    Season,
    TournamentLevel,
    TeamEventStatsOptions,
    calculateLeagueTeamEventStats,
    type LeagueFrontendMatch,
} from "@ftc-scout/common";
import { DATA_SOURCE } from "../data-source";
import { League } from "../entities/League";
import { LeagueTeam } from "../entities/LeagueTeam";
import { Event } from "../entities/Event";
import { Match } from "../entities/Match";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { FindOptionsWhere, IsNull } from "typeorm";

type MatchContribution = {
    matchId: number;
    matchKey: string;
    rp: number;
    tb1: number;
    tb2: number;
};

type LeagueIdentifier = {
    code: string;
    regionCode: string | null;
};

export async function recomputeLeagueRankings(
    season: Season,
    leagueCode: string,
    regionCode: string | null
) {
    let where: FindOptionsWhere<League>[] =
        regionCode == null
            ? [{ season, code: leagueCode }]
            : [{ season, code: leagueCode, regionCode }];
    let league = await League.findOne({ where });
    if (!league) return;
    if (league.regionCode == null) {
        console.warn(
            `Skipping league ranking recompute for ${leagueCode} (${season}) due to missing region code.`
        );
        return;
    }
    let leagueRegion = league.regionCode;

    let { leagueMeetCodes, tournamentCodes, includedLeagues } = await eventsForLeague(
        season,
        league
    );
    let eventCodesToFetch = [...new Set([...leagueMeetCodes, ...tournamentCodes])];

    if (!eventCodesToFetch.length) {
        await clearLeagueRankings(season, leagueCode, leagueRegion);
        return;
    }

    let matches = await DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("m")
        .where("m.event_season = :season", { season })
        .andWhere("m.event_code IN (:...codes)", { codes: eventCodesToFetch })
        .andWhere("m.has_been_played")
        .leftJoinAndMapMany(
            "m.scores",
            `match_score_${season}`,
            "ms",
            "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id"
        )
        .leftJoinAndMapMany(
            "m.teams",
            "team_match_participation",
            "tmp",
            "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id"
        )
        .getMany();

    if (!matches.length) {
        await clearLeagueRankings(season, leagueCode, leagueRegion);
        return;
    }

    let frontendMatches: LeagueFrontendMatch[] = matches.map((m) => ({
        id: m.id,
        ...m.toFrontend(),
        eventCode: m.eventCode,
    }));

    let leagueTeamWhere: FindOptionsWhere<LeagueTeam>[] = includedLeagues.map((l) => ({
        season,
        leagueCode: l.code,
        regionCode: regionCondition(l.regionCode),
    }));
    let leagueTeams = leagueTeamWhere.length
        ? await LeagueTeam.find({
              where: leagueTeamWhere,
          })
        : [];
    let eventTeamNumbers = frontendMatches
        .flatMap((m) => m.teams.map((t) => t.teamNumber))
        .filter((n): n is number => n != null);
    let teamNumbers = [...new Set(eventTeamNumbers)];
    if (!teamNumbers.length && leagueTeams.length) {
        teamNumbers = leagueTeams.map((t) => t.teamNumber);
    }

    let descriptor = DESCRIPTORS[season];
    let selections = buildMatchSelections(frontendMatches, descriptor, new Set(tournamentCodes));

    const includeMatch: TeamEventStatsOptions["includeMatch"] = (teamNumber, match) => {
        let matchesForTeam = selections.get(teamNumber);
        if (!matchesForTeam) return false;
        return matchesForTeam.has(makeMatchKey(match));
    };

    let stats = calculateLeagueTeamEventStats(
        season,
        leagueCode,
        league.remote,
        frontendMatches,
        teamNumbers,
        {
            includeMatch,
            forceAverageOpr: true,
        }
    );

    let repo = DATA_SOURCE.getRepository(LeagueRankingSchemas[season]);
    await repo
        .createQueryBuilder()
        .delete()
        .where("season = :season AND league_code = :leagueCode AND region_code = :regionCode", {
            season,
            leagueCode,
            regionCode: leagueRegion,
        })
        .execute();

    let rows = stats
        .filter((s) => s.hasStats)
        .map((s) => ({
            season: s.season,
            leagueCode,
            regionCode: leagueRegion,
            teamNumber: s.teamNumber,
            isRemote: s.isRemote,
            rank: s.rank,
            rp: s.rp,
            tb1: s.tb1,
            tb2: s.tb2,
            wins: s.wins,
            losses: s.losses,
            ties: s.ties,
            dqs: s.dqs,
            qualMatchesPlayed: s.qualMatchesPlayed,
            hasStats: s.hasStats,
            tot: s.tot,
            avg: s.avg,
            min: s.min,
            max: s.max,
            dev: s.dev,
            opr: s.opr,
        }));

    if (rows.length) {
        await repo.save(rows, { chunk: 200 });
    }
}

async function clearLeagueRankings(season: Season, leagueCode: string, regionCode: string) {
    let repo = DATA_SOURCE.getRepository(LeagueRankingSchemas[season]);
    await repo
        .createQueryBuilder()
        .delete()
        .where("season = :season AND league_code = :leagueCode AND region_code = :regionCode", {
            season,
            leagueCode,
            regionCode,
        })
        .execute();
}

function buildMatchSelections(
    frontendMatches: LeagueFrontendMatch[],
    descriptor: Descriptor,
    tournamentEventCodes: Set<string>
) {
    let contributions = new Map<number, MatchContribution[]>();
    let autoSelections = new Map<number, Set<string>>();

    for (let match of frontendMatches) {
        let isTournamentEvent = tournamentEventCodes.has(match.eventCode);
        let hasScores = hasAllianceScores(match.scores);

        if (isTournamentEvent) {
            if (!hasScores) continue;
            for (let participant of match.teams) {
                if (participant.surrogate) continue;
                if (!autoSelections.has(participant.teamNumber)) {
                    autoSelections.set(participant.teamNumber, new Set());
                }
                autoSelections.get(participant.teamNumber)!.add(makeMatchKey(match));
            }
            continue;
        }

        if (match.tournamentLevel != TournamentLevel.Quals || !hasScores) continue;

        for (let participant of match.teams) {
            if (participant.surrogate) continue;
            let metric = computeContribution(descriptor, match, participant);
            if (!metric) continue;
            if (!contributions.has(participant.teamNumber)) {
                contributions.set(participant.teamNumber, []);
            }
            contributions.get(participant.teamNumber)!.push(metric);
        }
    }

    let selections = new Map<number, Set<string>>();
    for (let [teamNumber, metrics] of contributions.entries()) {
        metrics.sort(compareContributions);
        let selected = metrics.slice(0, 10).map((m) => m.matchKey);
        selections.set(teamNumber, new Set(selected));
    }

    for (let [teamNumber, matches] of autoSelections.entries()) {
        if (!selections.has(teamNumber)) {
            selections.set(teamNumber, new Set());
        }
        let set = selections.get(teamNumber)!;
        matches.forEach((m) => set.add(m));
    }

    return selections;
}

function compareContributions(a: MatchContribution, b: MatchContribution) {
    if (b.rp !== a.rp) return b.rp - a.rp;
    if (b.tb1 !== a.tb1) return b.tb1 - a.tb1;
    if (b.tb2 !== a.tb2) return b.tb2 - a.tb2;
    if (a.matchId !== b.matchId) return a.matchId - b.matchId;
    return a.matchKey.localeCompare(b.matchKey);
}

function computeContribution(
    descriptor: Descriptor,
    match: LeagueFrontendMatch,
    participant: LeagueFrontendMatch["teams"][number]
): MatchContribution | null {
    if (participant.dq) {
        return {
            matchId: match.id,
            matchKey: makeMatchKey(match),
            rp: 0,
            tb1: 0,
            tb2: 0,
        };
    }

    let allianceScore = getAllianceScore(match, participant.alliance);
    if (!allianceScore) return null;
    let winningAlliance = getWinningAlliance(match);
    let rp = computeRankingPoints(descriptor, participant, allianceScore, winningAlliance);
    let { tb1, tb2 } = computeTieBreakerPoints(descriptor, match, allianceScore);

    return {
        matchId: match.id,
        matchKey: makeMatchKey(match),
        rp,
        tb1,
        tb2,
    };
}

function getAllianceScore(
    match: LeagueFrontendMatch,
    alliance: Alliance
): Record<string, any> | null {
    if (!match.scores) return null;
    if ("red" in match.scores) {
        return alliance == Alliance.Red ? match.scores.red : match.scores.blue;
    }
    return match.scores;
}

function getWinningAlliance(match: LeagueFrontendMatch): Alliance | null {
    if (!hasAllianceScores(match.scores)) return null;
    if (match.scores.red.totalPoints > match.scores.blue.totalPoints) return Alliance.Red;
    if (match.scores.blue.totalPoints > match.scores.red.totalPoints) return Alliance.Blue;
    return null;
}

function computeRankingPoints(
    descriptor: Descriptor,
    participant: LeagueFrontendMatch["teams"][number],
    allianceScore: Record<string, any>,
    winningAlliance: Alliance | null
) {
    switch (descriptor.rankings.rp) {
        case "TotalPoints":
            return allianceScore.totalPoints ?? 0;
        case "Record": {
            if (winningAlliance == participant.alliance) return 2;
            if (winningAlliance == null) return 1;
            return 0;
        }
        case "DecodeRP": {
            let base = 0;
            if (winningAlliance == participant.alliance) {
                base = 3;
            } else if (winningAlliance == null) {
                base = 1;
            }
            return (
                base +
                (allianceScore.movementRp ? 1 : 0) +
                (allianceScore.goalRp ? 1 : 0) +
                (allianceScore.patternRp ? 1 : 0)
            );
        }
    }
}

function computeTieBreakerPoints(
    descriptor: Descriptor,
    match: LeagueFrontendMatch,
    allianceScore: Record<string, any>
) {
    if (descriptor.rankings.tb == "LosingScore") {
        if (!hasAllianceScores(match.scores)) {
            return { tb1: 0, tb2: 0 };
        }
        let losingScore = Math.min(
            match.scores.red.totalPointsNp ?? 0,
            match.scores.blue.totalPointsNp ?? 0
        );
        return { tb1: losingScore, tb2: 0 };
    }

    switch (descriptor.rankings.tb) {
        case "AutoEndgameTot":
        case "AutoEndgameAvg":
            return {
                tb1: allianceScore.autoPoints ?? 0,
                tb2: allianceScore.egPoints ?? 0,
            };
        case "AutoAscentAvg":
            return {
                tb1: allianceScore.autoPoints ?? 0,
                tb2: allianceScore.dcParkPoints ?? 0,
            };
        case "AvgNpBase":
            return {
                tb1: allianceScore.totalPointsNp ?? 0,
                tb2: allianceScore.dcBasePoints ?? 0,
            };
        default:
            return { tb1: 0, tb2: 0 };
    }
}

function hasAllianceScores(
    scores: LeagueFrontendMatch["scores"]
): scores is { red: any; blue: any } {
    if (!scores || typeof scores !== "object") return false;
    return (
        "red" in scores &&
        "blue" in scores &&
        !!(scores as any).red &&
        !!(scores as any).blue &&
        (scores as any).red.totalPoints != null &&
        (scores as any).blue.totalPoints != null
    );
}

function makeMatchKey(match: LeagueFrontendMatch) {
    return `${match.eventCode}:${match.id}`;
}

async function eventsForLeague(season: Season, league: League) {
    let childLeagues = await League.find({
        where: { season, parentLeagueCode: league.code },
        select: ["code", "regionCode"],
    });
    let includedLeagues = childLeagues.length
        ? childLeagues.map<LeagueIdentifier>((l) => ({
              code: l.code,
              regionCode: l.regionCode ?? null,
          }))
        : [];

    includedLeagues.push({ code: league.code, regionCode: league.regionCode ?? null });
    includedLeagues = dedupeLeagues(includedLeagues);

    let eventWhere: FindOptionsWhere<Event>[] = includedLeagues.map((l) => ({
        season,
        leagueCode: l.code,
        regionCode: regionCondition(l.regionCode),
    }));
    let events = eventWhere.length ? await Event.find({ where: eventWhere }) : [];

    let leagueMeetCodes = events.filter((e) => e.type == EventType.LeagueMeet).map((e) => e.code);
    let tournamentCodes = events
        .filter((e) => e.type == EventType.LeagueTournament)
        .map((e) => e.code);

    return { leagueMeetCodes, tournamentCodes, includedLeagues };
}

function dedupeLeagues(leagues: LeagueIdentifier[]) {
    let map = new Map<string, LeagueIdentifier>();
    for (let league of leagues) {
        let key = `${league.code}::${league.regionCode ?? ""}`;
        if (!map.has(key)) {
            map.set(key, league);
        }
    }
    return [...map.values()];
}

function regionCondition(regionCode: string | null) {
    return regionCode == null ? IsNull() : regionCode;
}
