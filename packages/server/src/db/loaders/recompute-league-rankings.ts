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
    FrontendMatch,
} from "@ftc-scout/common";
import { DATA_SOURCE } from "../data-source";
import { League } from "../entities/League";
import { LeagueTeam } from "../entities/LeagueTeam";
import { Event } from "../entities/Event";
import { Match } from "../entities/Match";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { FindOptionsWhere, In, IsNull, Not } from "typeorm";

/*This seems to be a mistake in the ftc-events logic, where league meets
 * not in the league were/are being counted towards league rankings, even though they shouldn't be.
 *
 * Temporarily adding all league meets in the region to the rankings calculation until we can confirm whether this is intentional or not, and fix if it's not.
 *
 * Well this is a feature now, since this is normal in Romania and allowed somehow
 * */
const COUNT_NON_LEAGUE_LEAGUE_MEETS = true;

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

    console.info(
        `Recomputing league rankings for ${leagueCode} (${season}, region: ${leagueRegion})`
    );

    let { leagueMeetCodes, tournamentCodes, includedLeagues } = await eventsForLeague(
        season,
        league
    );
    let allEventCodes = [...new Set([...leagueMeetCodes, ...tournamentCodes])];
    let allEventCodesLeague = [...new Set([...leagueMeetCodes, ...tournamentCodes])];

    if (!allEventCodes.length) {
        await clearLeagueRankings(season, leagueCode, leagueRegion);
        return;
    }

    if (COUNT_NON_LEAGUE_LEAGUE_MEETS) {
        let allLeaugeMeetsInRegion = await Event.find({
            where: {
                season,
                type: EventType.LeagueMeet,
                code: Not(In(leagueMeetCodes.length ? leagueMeetCodes : [""])),
                regionCode: regionCondition(leagueRegion),
            },
        });
        let allLeagueMeetCodesInRegion = allLeaugeMeetsInRegion.map((e) => e.code);
        allEventCodes = allEventCodes.concat(allLeagueMeetCodesInRegion);
    }

    let strictTeamNumbers = new Set(
        (
            await LeagueTeam.find({
                where: {
                    season,
                    leagueCode: league.code,
                    regionCode: regionCondition(league.regionCode),
                },
            })
        ).map((t) => t.teamNumber)
    );

    let matches = await DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("m")
        .where("m.event_season = :season", { season })
        .andWhere("m.event_code IN (:...codes)", { codes: allEventCodes })
        .andWhere("m.has_been_played")
        .andWhere("m.tournament_level = :tournamentLevel", {
            tournamentLevel: TournamentLevel.Quals,
        })
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

    let allFrontendMatches = matches.map(
        (m) =>
            ({
                id: m.id,
                ...m.toFrontend(),
                eventCode: m.eventCode,
            } as LeagueFrontendMatch)
    );

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
    let eventTeamNumbers = allFrontendMatches
        .filter((m) => allEventCodesLeague.includes(m.eventCode))
        .flatMap((m) => m.teams.map((t) => t.teamNumber))
        .filter((n): n is number => n != null);

    let teamNumbers: number[] = [];
    if (leagueTeams.length) {
        teamNumbers = leagueTeams.map((t) => t.teamNumber);
    } else {
        teamNumbers = [...new Set(eventTeamNumbers)];
    }

    let descriptor = DESCRIPTORS[season];
    let selections = buildMatchSelections(
        allFrontendMatches,
        descriptor,
        new Set(tournamentCodes),
        teamNumbers
    );

    selections = new Map(
        [...selections.entries()].filter(([teamNumber]) => teamNumbers.includes(teamNumber))
    );

    const includeMatch: TeamEventStatsOptions["includeMatch"] = (teamNumber, match) => {
        let matchesForTeam = selections.get(teamNumber);
        if (!matchesForTeam) return false;
        return matchesForTeam.has(makeMatchKey(match));
    };

    let stats = calculateLeagueTeamEventStats(
        season,
        leagueCode,
        league.remote,
        allFrontendMatches,
        teamNumbers,
        {
            includeMatch,
            forceAverageOpr: true,
        }
    );

    let allMatchStats = calculateLeagueTeamEventStats(
        season,
        leagueCode,
        league.remote,
        allFrontendMatches,
        teamNumbers,
        {
            includeMatch: (teamNumber, match) =>
                teamNumbers.includes(teamNumber) && match.eventCode != "filler",
        }
    );

    stats = stats
        .filter((s) => strictTeamNumbers.size === 0 || strictTeamNumbers.has(s.teamNumber))
        .sort((a, b) => a.rank - b.rank)
        .map((s, i) => ({ ...s, rank: i + 1 }));
    let totalsByTeam = new Map(allMatchStats.map((s) => [s.teamNumber, s]));
    stats = stats.map((s) => {
        let totals = totalsByTeam.get(s.teamNumber);
        if (totals) {
            s.qualMatchesPlayed = totals.qualMatchesPlayed;
            s.avgRp = totals.rp;
            s.tot = totals.tot;
            s.avg = totals.avg;
            s.min = totals.min;
            s.max = totals.max;
            s.dev = totals.dev;
            s.opr = totals.opr;
        }
        return s;
    });

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
            avgRp: s.avgRp,
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
    tournamentEventCodes: Set<string>,
    teamNumbers?: number[]
) {
    let contributions = new Map<number, MatchContribution[]>();
    let autoSelections = new Map<number, Set<string>>();

    for (let teamNumber of teamNumbers ?? []) {
        autoSelections.set(teamNumber, new Set());
        contributions.set(teamNumber, []);
    }

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
        for (let i = 1; i <= 10 && selected.length < 10; i++) {
            selected.push(makeMatchKey({ eventCode: "filler", id: i } as LeagueFrontendMatch));
        }
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

export function getWinningAlliance(match: FrontendMatch): Alliance | null {
    if (!hasAllianceScores(match.scores)) return null;
    if (match.scores.red.totalPoints > match.scores.blue.totalPoints) return Alliance.Red;
    if (match.scores.blue.totalPoints > match.scores.red.totalPoints) return Alliance.Blue;
    return null;
}

export function computeRankingPoints(
    descriptor: Descriptor,
    participant: FrontendMatch["teams"][number],
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
        where: [
            { season, parentLeagueCode: league.parentLeagueCode ?? "" }, // Get all league tournaments if current League is a child league (Tournament)
            { season, parentLeagueCode: league.code, regionCode: league.regionCode }, // Get all league tournaments if current League is the parent league
            { season, code: league.parentLeagueCode ?? "", regionCode: league.regionCode }, // Get all League meets
        ],
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
