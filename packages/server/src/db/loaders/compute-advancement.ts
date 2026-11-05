import {
    Alliance,
    CURRENT_SEASON,
    Season,
    TournamentLevel,
    EventType,
    type AdvancementPointsConfig,
    AdvancementEligibility,
    getAdvancementEligibility,
    isEligible,
    hasAllianceScores,
} from "@ftc-scout/common";
import { ADVANCEMENT_CONFIGS } from "@ftc-scout/common";
import { AdvancementScore } from "../entities/AdvancementScore";
import { Event } from "../entities/Event";
import { DATA_SOURCE } from "../data-source";
import { TeamEventParticipationSchemas } from "../entities/dyn/team-event-participation";
import { Match } from "../entities/Match";
import { Award } from "../entities/Award";
import { getAlliances, type AllianceApi } from "../../ftc-api/get-alliances";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { MatchScore, MatchScoreSchemas } from "../entities/dyn/match-score";
import { Team } from "../entities/Team";
import { In } from "typeorm";
import {
    type LeagueSelection,
    countedLeagueMatches,
    loadLeagueSelection,
} from "./recompute-league-rankings";

const SUPPORTED_EVENT_TYPES: EventType[] = [
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.SuperQualifier,
    EventType.Championship,
    EventType.FIRSTChampionship,
];

export const QUALIFYING_EVENT_TYPES: EventType[] = [
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.SuperQualifier,
    EventType.Championship,
];

// Teams can only advance from the first few Qualifiers and League Tournaments they play in.
const EVENT_LIMIT_TYPES: EventType[] = [EventType.Qualifier, EventType.LeagueTournament];

type TeamRow = {
    teamNumber: number;
    qualPoints: number | null;
    isQualFinal: boolean;
    allianceSelectionPoints: number | null;
    isAllianceSelectionFinal: boolean;
    playoffPoints: number | null;
    isPlayoffPointsFinal: boolean;
    awardPoints: number | null;
    totalPoints: number | null;
    advancementRank: number | null;
    rank: number | null;
    eligibility: AdvancementEligibility;
    advanced: boolean;
    averageNPMatchPoints?: number;
    averageAutoPoints?: number;
    highestNPMatchPoints?: number;
    secondHighestNPMatchPoints?: number;
};

type QualRow = {
    teamNumber: number;
    rank: number;
    qualMatchesPlayed?: number;
    averageNPMatchPoints?: number;
    averageAutoPoints?: number;
    highestNPMatchPoints?: number;
};

type DivisionTeamInfo = {
    qualPoints: number | null;
    isQualFinal: boolean;
    allianceSelectionPoints: number | null;
    isAllianceSelectionFinal: boolean;
    tiebreakScores?: TiebreakScores | undefined;
};

function allianceTeamNumbers(a: AllianceApi): number[] {
    return [a.captain, a.round1, a.round2, a.round3, a.backup]
        .map((t) => t?.teamNumber)
        .filter((n): n is number => typeof n === "number");
}

function computeAwardPointsMap(
    awards: Award[],
    config: AdvancementPointsConfig
): {
    awardsLoaded: boolean;
    awardPts: Map<number, number>;
} {
    let awardsLoaded = awards.length > 0;
    let awardPts = new Map<number, number>();

    for (let aw of awards) {
        let inc = config.getAwardPoints(aw.type, aw.placement as 1 | 2 | 3);
        if (inc === 0) continue;

        let existing = awardPts.get(aw.teamNumber) ?? 0;
        awardPts.set(aw.teamNumber, Math.max(existing, inc));
    }

    return { awardsLoaded, awardPts };
}

function computeAllianceSelectionFromAlliances(
    alliances: AllianceApi[] | null,
    config: AdvancementPointsConfig
): {
    alliancePoints: Map<number, number>;
    allianceTeams: Set<number>;
} {
    let alliancePoints = new Map<number, number>();
    let allianceTeams = new Set<number>();

    if (!alliances) return { alliancePoints, allianceTeams };

    for (let alliance of alliances) {
        let pts = config.calculateAllianceSelectionPoints(alliance.number);
        allianceTeamNumbers(alliance).forEach((n) => {
            alliancePoints.set(n, pts);
            allianceTeams.add(n);
        });
    }

    return { alliancePoints, allianceTeams };
}

function normalizeAllianceSelectionPoints(
    qualPoints: number | null,
    rawSelectionPoints: number | null,
    isAllianceSelectionFinal: boolean
): number | null {
    if (qualPoints == null) return null;
    if (!isAllianceSelectionFinal && rawSelectionPoints == null) return null;
    if (isAllianceSelectionFinal && rawSelectionPoints == null) return 0;
    return rawSelectionPoints;
}

function normalizeAwardPoints(awardsLoaded: boolean, rawAwardPoints: number | null): number | null {
    if (awardsLoaded && rawAwardPoints == null) return 0;
    return rawAwardPoints;
}

function sumTotalPoints(
    qualPoints: number | null,
    allianceSelectionPoints: number | null,
    playoffPoints: number | null,
    awardPoints: number | null
): number {
    return (
        (qualPoints ?? 0) +
        (allianceSelectionPoints ?? 0) +
        (playoffPoints ?? 0) +
        (awardPoints ?? 0)
    );
}

async function getQualRowsForEvent(season: Season, event: Event): Promise<QualRow[]> {
    let teps = await DATA_SOURCE.getRepository(TeamEventParticipationSchemas[season]).findBy({
        season,
        eventCode: event.code,
    });

    // FIRST ranks the teams that played at a league tournament by their league ranking, which also
    // counts their best league meet matches. Registered teams that didn't play aren't ranked.
    if (event.type == EventType.LeagueTournament && event.leagueCode) {
        let played = new Map(
            teps.filter((t) => t.qualMatchesPlayed > 0).map((t) => [t.teamNumber, t])
        );
        let leagueRanks = await DATA_SOURCE.getRepository(LeagueRankingSchemas[season]).find({
            where: {
                season,
                leagueCode: event.leagueCode,
                ...(event.regionCode ? { regionCode: event.regionCode } : {}),
            },
            order: { rank: "ASC" },
        });
        return leagueRanks
            .filter((lr) => played.has(lr.teamNumber))
            .map((lr, i) => ({
                teamNumber: lr.teamNumber,
                rank: i + 1,
                qualMatchesPlayed: played.get(lr.teamNumber)!.qualMatchesPlayed,
            }));
    }

    return teps.map((t) => ({
        teamNumber: t.teamNumber,
        rank: t.rank,
        qualMatchesPlayed: (t as any).qualMatchesPlayed ?? undefined,
    }));
}

async function getTeamCountFromPlayedMatches(season: Season, eventCode: string): Promise<number> {
    let result = await TeamMatchParticipation.createQueryBuilder("tmp")
        .innerJoin(
            Match,
            "m",
            "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id"
        )
        .where("tmp.season = :season", { season })
        .andWhere("tmp.event_code = :eventCode", { eventCode })
        .andWhere("m.has_been_played")
        .select("COUNT(DISTINCT tmp.team_number)", "count")
        .getRawOne();

    return Number(result?.count ?? 0);
}

async function getPlayoffMatchesForEvent(season: Season, eventCode: string): Promise<Match[]> {
    return DATA_SOURCE.getRepository(Match).find({
        where: [
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Semis },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Finals },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.DoubleElim },
        ],
    });
}

async function loadEligibilityData(
    season: Season,
    event: Event,
    teamNumberList: number[]
): Promise<{
    teamRegionMap: Map<number, string>;
    qualEventCounts: Map<number, number>;
    previouslyAdvanced: Set<number>;
}> {
    const teamRegionMap = new Map<number, string>();
    const qualEventCounts = new Map<number, number>();
    const previouslyAdvanced = new Set<number>();

    if (teamNumberList.length === 0) return { teamRegionMap, qualEventCounts, previouslyAdvanced };

    // Teams only store the home region FIRST lists for the current season, and regions change
    // between seasons (Texas was one region in 2025 and four in 2026), so earlier seasons can't be
    // checked. Teams without a stored region aren't checked either.
    if (season == CURRENT_SEASON) {
        let teams = await Team.createQueryBuilder("team")
            .select(["team.number", "team.regionCode"])
            .where("team.number IN (:...teamNumbers)", { teamNumbers: teamNumberList })
            .getMany();
        teams.forEach((t) => {
            if (t.regionCode) teamRegionMap.set(t.number, t.regionCode);
        });
    }

    // Registered teams get stats rows even if they never showed up, so only count events they played.
    let qualCountRows = EVENT_LIMIT_TYPES.includes(event.type as EventType)
        ? await DATA_SOURCE.getRepository(TeamEventParticipationSchemas[season])
              .createQueryBuilder("tep")
              .innerJoin(Event, "e", "tep.season = e.season AND tep.eventCode = e.code")
              .where("tep.season = :season", { season })
              .andWhere("tep.teamNumber IN (:...teamNumbers)", { teamNumbers: teamNumberList })
              .andWhere("tep.qualMatchesPlayed > 0")
              .andWhere("e.type IN (:...types)", { types: EVENT_LIMIT_TYPES })
              .andWhere("e.end < :eventStart", { eventStart: event.start })
              .select("tep.teamNumber", "teamNumber")
              .addSelect("COUNT(DISTINCT tep.eventCode)", "cnt")
              .groupBy("tep.teamNumber")
              .getRawMany()
        : [];
    qualCountRows.forEach((row: any) => {
        qualEventCounts.set(Number(row.teamNumber), Number(row.cnt));
    });

    // Teams that already advanced to an event like the one this event advances to don't take
    // another slot, whichever type of event they advanced from. This covers a Qualifier and a League
    // Tournament feeding the same Championship, and regions with several Championships or Super
    // Qualifiers at the same level.
    let target = event.advancesTo
        ? await Event.findOne({
              where: { season, code: event.advancesTo },
              select: ["season", "code", "type"],
          })
        : null;
    let priorAdvQuery = DATA_SOURCE.getRepository(AdvancementScore)
        .createQueryBuilder("as")
        .innerJoin(Event, "e", "as.season = e.season AND as.eventCode = e.code")
        .where("as.season = :season", { season })
        .andWhere("as.teamNumber IN (:...teamNumbers)", { teamNumbers: teamNumberList })
        .andWhere("as.advanced = true")
        .andWhere("e.end < :eventStart", { eventStart: event.start });
    if (target) {
        priorAdvQuery
            .innerJoin(Event, "t", "t.season = e.season AND t.code = e.advancesTo")
            .andWhere("t.type = :targetType", { targetType: target.type });
    } else if (event.advancesTo) {
        // FIRST Championship isn't an event of the season, only a name.
        priorAdvQuery.andWhere("e.advancesTo = :advancesTo", { advancesTo: event.advancesTo });
    } else {
        priorAdvQuery.andWhere("e.type = :type", { type: event.type });
    }
    let priorAdvRows = await priorAdvQuery.select("as.teamNumber", "teamNumber").getRawMany();
    priorAdvRows.forEach((row: any) => previouslyAdvanced.add(Number(row.teamNumber)));

    return { teamRegionMap, qualEventCounts, previouslyAdvanced };
}

function sortRowsByTiebreak(rows: TeamRow[], config: AdvancementPointsConfig) {
    rows.sort((a, b) => {
        if (!config.tieBreakKeys) return 0;

        for (let key of config.tieBreakKeys) {
            // Use the enum value directly as a property key
            let aVal = a[key] ?? 0;
            let bVal = b[key] ?? 0;

            if (bVal !== aVal) {
                return bVal - aVal;
            }
        }

        return 0;
    });
}

function assignAdvancedSlots(event: Event, rows: TeamRow[]) {
    if ((event.advancementSlots ?? 0) <= 0) return;
    if (!QUALIFYING_EVENT_TYPES.includes(event.type as EventType)) return;

    if (!rows.some((r) => r.awardPoints && r.awardPoints > 0)) {
        return;
    }

    let eligibleRows = rows.filter((r) => isEligible(r.eligibility));

    if (
        rows
            .filter(
                (r) =>
                    !(
                        r.qualPoints == null ||
                        r.allianceSelectionPoints == null ||
                        r.playoffPoints == null
                    )
            )
            .some((r) => !r.isQualFinal || !r.isAllianceSelectionFinal || !r.isPlayoffPointsFinal)
    ) {
        eligibleRows.forEach((r) => (r.advanced = false));
        return;
    }

    let advSlots = Math.min(event.advancementSlots ?? 0, eligibleRows.length);
    for (let i = 0; i < advSlots; i++) {
        eligibleRows[i].advanced = true;
    }
}

function finalizeRowRanks(rows: TeamRow[]) {
    let rankCounter = 0;
    let advancementRankCounter = 0;
    rows.forEach((r) => {
        r.totalPoints = r.totalPoints ?? 0;
        if (isEligible(r.eligibility)) {
            advancementRankCounter++;
            r.advancementRank = advancementRankCounter;
        } else {
            r.advancementRank = null;
        }
        rankCounter++;
        r.rank = rankCounter;
    });
}

async function saveAdvancementRows(season: Season, eventCode: string, rows: TeamRow[]) {
    await DATA_SOURCE.transaction(async (em) => {
        await em
            .createQueryBuilder()
            .delete()
            .from(AdvancementScore)
            .where("season = :season", { season })
            .andWhere("eventCode = :eventCode", { eventCode })
            .execute();

        for (let r of rows) {
            let existing = AdvancementScore.createEmpty(season, eventCode, r.teamNumber);
            existing.qualPoints = r.qualPoints;
            existing.isQualFinal = r.isQualFinal;
            existing.allianceSelectionPoints = r.allianceSelectionPoints;
            existing.isAllianceSelectionFinal = r.isAllianceSelectionFinal;
            existing.playoffPoints = r.playoffPoints;
            existing.isPlayoffPointsFinal = r.isPlayoffPointsFinal;
            existing.awardPoints = r.awardPoints;
            existing.totalPoints = r.totalPoints;
            existing.rank = (r as any).rank ?? null;
            existing.advancementRank = r.advancementRank;
            existing.eligibility = r.eligibility;
            existing.advanced = r.advanced;
            await em.save(existing);
        }
    });
}

async function computeElimPlacementsByAlliance(
    season: Season,
    eventCode: string,
    alliances: AllianceApi[] | null,
    playoffMatches: Match[]
): Promise<{
    placementByAlliance: Map<number, { placement: number; isFinal: boolean }>;
    aliveAlliances: number[];
}> {
    if (!alliances || alliances.length === 0 || playoffMatches.length === 0) {
        return { placementByAlliance: new Map(), aliveAlliances: [] };
    }

    let teamToAlliance = new Map<number, number>();
    alliances.forEach((a) => {
        allianceTeamNumbers(a).forEach((n) => teamToAlliance.set(n, a.number));
    });

    let matchIds = playoffMatches.map((m) => m.id);
    let tmps = await TeamMatchParticipation.findBy({
        season,
        eventCode,
        matchId: In(matchIds),
    });
    let scores = await DATA_SOURCE.getRepository(MatchScoreSchemas[season]).findBy({
        season,
        eventCode,
        matchId: In(matchIds),
    });

    type AllianceResult = { allianceNum: number; losses: number; eliminatedAt?: number };
    let allianceResults = new Map<number, AllianceResult>();
    // FIRST also lists alliances without teams when fewer were picked, those never play.
    alliances
        .filter((a) => allianceTeamNumbers(a).length > 0)
        .forEach((a) => allianceResults.set(a.number, { allianceNum: a.number, losses: 0 }));

    function allianceNumberForColor(matchId: number, color: Alliance): number | null {
        let teamsThisSide = tmps
            .filter((t) => t.matchId == matchId && t.alliance == color)
            .map((t) => t.teamNumber);
        for (let t of teamsThisSide) {
            let a = teamToAlliance.get(t);
            if (a != null) return a;
        }
        return null;
    }

    function scoreFor(matchId: number, color: Alliance): number | null {
        let s = scores.find((s) => s.matchId == matchId && s.alliance == color);
        return s ? (s as any).totalPoints ?? null : null;
    }

    let elimOrder = 0;
    let sortedMatches = playoffMatches.slice().sort((a, b) => a.id - b.id);
    for (let m of sortedMatches) {
        if (!m.hasBeenPlayed) continue;

        let redAlliance = allianceNumberForColor(m.id, Alliance.Red);
        let blueAlliance = allianceNumberForColor(m.id, Alliance.Blue);
        if (redAlliance == null || blueAlliance == null) continue;

        let allTmps = tmps.filter((t) => t.matchId === m.id);

        let redTmps = allTmps.filter((t) => t.alliance === Alliance.Red);
        let blueTmps = allTmps.filter((t) => t.alliance === Alliance.Blue);

        let redDq = redTmps.some((t) => t.noShow || t.dq);
        let blueDq = blueTmps.some((t) => t.noShow || t.dq);

        let redScore = redDq ? 0 : scoreFor(m.id, Alliance.Red);
        let blueScore = blueDq ? 0 : scoreFor(m.id, Alliance.Blue);
        if (redScore == null || blueScore == null) continue;
        if (redScore == blueScore) continue;

        let redWins = redScore > blueScore;
        let loser = redWins ? blueAlliance : redAlliance;

        let loserRec = allianceResults.get(loser);
        if (!loserRec) {
            loserRec = { allianceNum: loser, losses: 0 };
            allianceResults.set(loser, loserRec);
        }
        loserRec.losses += 1;
        if (loserRec.losses >= 2 && loserRec.eliminatedAt == null) {
            loserRec.eliminatedAt = ++elimOrder;
        }
    }

    let alive = [...allianceResults.values()].filter((r) => r.eliminatedAt == null);
    let eliminated = [...allianceResults.values()].filter((r) => r.eliminatedAt != null);
    eliminated.sort((a, b) => (a.eliminatedAt ?? 0) - (b.eliminatedAt ?? 0));

    let allianceCount = alive.length + eliminated.length;
    let placementByAlliance = new Map<number, { placement: number; isFinal: boolean }>();
    eliminated.forEach((r, idx) => {
        placementByAlliance.set(r.allianceNum, { placement: allianceCount - idx, isFinal: true });
    });

    return { placementByAlliance, aliveAlliances: alive.map((r) => r.allianceNum) };
}

function applyPlayoffPointsToAlliance(
    alliances: AllianceApi[] | null,
    allianceNum: number,
    points: number,
    playoffPts: Map<number, { points: number; isFinal: boolean }>,
    isFinal: boolean = true
) {
    let alliance = alliances?.find((a) => a.number == allianceNum);
    if (!alliance) return;
    allianceTeamNumbers(alliance).forEach((n) => playoffPts.set(n, { points, isFinal }));
}

async function computeNormalPlayoffPoints(
    season: Season,
    eventCode: string,
    alliances: AllianceApi[] | null,
    playoffMatches: Match[],
    config: AdvancementPointsConfig
): Promise<{
    playoffPts: Map<number, { points: number; isFinal: boolean }>;
    playoffsComplete: boolean;
}> {
    let playoffPts = new Map<number, { points: number; isFinal: boolean }>();
    if (!alliances || alliances.length === 0 || playoffMatches.length === 0) {
        return { playoffPts, playoffsComplete: false };
    }

    let { placementByAlliance, aliveAlliances } = await computeElimPlacementsByAlliance(
        season,
        eventCode,
        alliances,
        playoffMatches
    );
    // FIRST adds double elimination matches as the bracket fills up, so having played every listed
    // match doesn't mean the playoffs are over.
    let playoffsComplete = aliveAlliances.length <= 1;

    if (playoffsComplete && aliveAlliances.length === 1) {
        placementByAlliance.set(aliveAlliances[0]!, { placement: 1, isFinal: true });
    }

    for (let [allianceNum, placement] of placementByAlliance.entries()) {
        if ((placement.placement === 1 || placement.placement === 2) && !playoffsComplete) continue;

        let points = 0;
        if (placement.placement >= 1 && placement.placement <= 8) {
            points = config.getPlayoffPoints(placement.placement as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8);
        }
        applyPlayoffPointsToAlliance(alliances, allianceNum, points, playoffPts);
    }

    if (playoffsComplete) {
        alliances.forEach((a) => {
            allianceTeamNumbers(a).forEach((n) => {
                if (!playoffPts.has(n)) playoffPts.set(n, { points: 0, isFinal: true });
            });
        });
    } else {
        let amountAlive = aliveAlliances.length;
        aliveAlliances.forEach((a) => {
            let intermediatePoints = config.getPlayoffPoints(
                amountAlive as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
            );
            allianceTeamNumbers(alliances.find((al) => al.number === a)!).forEach((n) => {
                playoffPts.set(n, { points: intermediatePoints, isFinal: false });
            });
        });
    }

    return { playoffPts, playoffsComplete };
}

function applyDivisionPlayoffPoints(
    alliances: AllianceApi[] | null,
    placementByAlliance: Map<number, { placement: number; isFinal: boolean }>,
    playoffPts: Map<number, { points: number; isFinal: boolean }>,
    config: AdvancementPointsConfig
) {
    for (let [allianceNum, placement] of placementByAlliance.entries()) {
        if (placement.placement === 1) continue;
        let pts = config.getDivisionPlayoffPoints(placement.placement as 2 | 3 | 4 | 5 | 6 | 7 | 8);
        applyPlayoffPointsToAlliance(alliances, allianceNum, pts, playoffPts, placement.isFinal);
    }
}

async function computeParentFinalistsPlayoffPoints(
    season: Season,
    parentEventCode: string,
    finalists: {
        divisionEventCode: string;
        alliances: AllianceApi[] | null;
        championAllianceNum: number;
    }[],
    playoffPts: Map<number, { points: number; isFinal: boolean }>,
    config: AdvancementPointsConfig
) {
    if (finalists.length !== 2) return;

    let finalistTeams = finalists.map((f) => {
        let alliance = f.alliances?.find((a) => a.number === f.championAllianceNum) ?? null;
        return {
            divisionEventCode: f.divisionEventCode,
            teamSet: new Set<number>(alliance ? allianceTeamNumbers(alliance) : []),
        };
    });
    if (!finalistTeams.every((f) => f.teamSet.size > 0)) return;

    let playoffMatches = await getPlayoffMatchesForEvent(season, parentEventCode);
    if (!playoffMatches.length) return;

    let playedMatches = playoffMatches.filter((m) => m.hasBeenPlayed).sort((a, b) => a.id - b.id);
    if (!playedMatches.length) return;

    let matchIds = playedMatches.map((m) => m.id);
    let tmps = await TeamMatchParticipation.findBy({
        season,
        eventCode: parentEventCode,
        matchId: In(matchIds),
    });
    let scores = await DATA_SOURCE.getRepository(MatchScoreSchemas[season]).findBy({
        season,
        eventCode: parentEventCode,
        matchId: In(matchIds),
    });

    function scoreFor(matchId: number, color: Alliance): number | null {
        let s = scores.find((s) => s.matchId == matchId && s.alliance == color);
        return s ? (s as any).totalPoints ?? null : null;
    }

    let losses = new Map<string, number>(
        finalistTeams.map((f) => [f.divisionEventCode, 0] as const)
    );

    function divisionForTeams(teamNumbers: number[]): string | null {
        let best: { code: string; hits: number } | null = null;
        for (let f of finalistTeams) {
            let hits = teamNumbers.filter((t) => f.teamSet.has(t)).length;
            if (!best || hits > best.hits) best = { code: f.divisionEventCode, hits };
        }
        return best && best.hits > 0 ? best.code : null;
    }

    for (let m of playedMatches) {
        let redTeams = tmps
            .filter((t) => t.matchId === m.id && t.alliance === Alliance.Red)
            .map((t) => t.teamNumber);
        let blueTeams = tmps
            .filter((t) => t.matchId === m.id && t.alliance === Alliance.Blue)
            .map((t) => t.teamNumber);

        let redDiv = divisionForTeams(redTeams);
        let blueDiv = divisionForTeams(blueTeams);
        if (!redDiv || !blueDiv || redDiv === blueDiv) continue;

        let redScore = scoreFor(m.id, Alliance.Red);
        let blueScore = scoreFor(m.id, Alliance.Blue);
        if (redScore == null || blueScore == null) continue;
        if (redScore === blueScore) continue;

        let redWins = redScore > blueScore;
        let loserDiv = redWins ? blueDiv : redDiv;
        losses.set(loserDiv, (losses.get(loserDiv) ?? 0) + 1);
    }

    let eliminated = [...losses.entries()].find(([, l]) => l >= 2);
    let loserDiv: string | null = eliminated?.[0] ?? null;
    let winnerDiv: string | null =
        loserDiv != null
            ? finalistTeams.find((f) => f.divisionEventCode !== loserDiv)?.divisionEventCode ?? null
            : null;

    if (!winnerDiv || !loserDiv) {
        if (playedMatches.length !== 1 || playoffMatches.length !== 1) return;

        let onlyMatch = playedMatches[0]!;
        let redTeams = tmps
            .filter((t) => t.matchId === onlyMatch.id && t.alliance === Alliance.Red)
            .map((t) => t.teamNumber);
        let blueTeams = tmps
            .filter((t) => t.matchId === onlyMatch.id && t.alliance === Alliance.Blue)
            .map((t) => t.teamNumber);
        let redDiv = divisionForTeams(redTeams);
        let blueDiv = divisionForTeams(blueTeams);
        if (!redDiv || !blueDiv || redDiv === blueDiv) return;

        let redScore = scoreFor(onlyMatch.id, Alliance.Red);
        let blueScore = scoreFor(onlyMatch.id, Alliance.Blue);
        if (redScore == null || blueScore == null) return;
        if (redScore === blueScore) return;

        let redWins = redScore > blueScore;
        winnerDiv = redWins ? redDiv : blueDiv;
        loserDiv = redWins ? blueDiv : redDiv;
    }

    let winner = finalistTeams.find((f) => f.divisionEventCode === winnerDiv)!;
    let loser = finalistTeams.find((f) => f.divisionEventCode === loserDiv)!;

    let winnerTeamSet = finalistTeams.find(
        (f) => f.divisionEventCode === winner.divisionEventCode
    )!.teamSet;
    let loserTeamSet = finalistTeams.find(
        (f) => f.divisionEventCode === loser.divisionEventCode
    )!.teamSet;

    winnerTeamSet.forEach((t) =>
        playoffPts.set(t, { points: config.getPlayoffPoints(1), isFinal: true })
    );
    loserTeamSet.forEach((t) =>
        playoffPts.set(t, { points: config.getPlayoffPoints(2), isFinal: true })
    );
}

// The non-penalty and auto points of the matches a team's tiebreakers use.
type TiebreakScores = { np: number[]; auto: number[] };

function addTiebreakScore(
    scoresPerTeam: Map<number, TiebreakScores>,
    teamNumber: number,
    np: number,
    auto: number
) {
    let scores = scoresPerTeam.get(teamNumber) ?? { np: [], auto: [] };
    scores.np.push(np);
    scores.auto.push(auto);
    scoresPerTeam.set(teamNumber, scores);
}

// Disqualified teams score 0 for the tiebreakers, like they do in the rankings.
function calculateScoresPerTeam(
    scores: MatchScore[],
    tmps: TeamMatchParticipation[],
    scoresPerTeam: Map<number, TiebreakScores>
) {
    for (let s of scores) {
        for (let t of tmps) {
            if (t.matchId != s.matchId || t.alliance != s.alliance || t.surrogate) continue;
            let dq = t.dq ?? false;
            addTiebreakScore(
                scoresPerTeam,
                t.teamNumber,
                dq ? 0 : s.totalPointsNp ?? 0,
                dq ? 0 : (s.autoPoints as number) ?? 0
            );
        }
    }
}

// League tournaments use the same matches as the league ranking: the best league meet matches,
// padded to 10 with empty ones, and the matches at the tournament.
function calculateLeagueScoresPerTeam(
    selection: LeagueSelection,
    teamNumbers: number[],
    scoresPerTeam: Map<number, TiebreakScores>
) {
    for (let teamNumber of teamNumbers) {
        let { matches, fillers } = countedLeagueMatches(selection, teamNumber);
        for (let m of matches) {
            let t = m.teams.find((t) => t.teamNumber == teamNumber && !t.surrogate);
            if (!t || !hasAllianceScores(m.scores)) continue;
            let s = t.alliance == Alliance.Red ? m.scores.red : m.scores.blue;
            addTiebreakScore(
                scoresPerTeam,
                teamNumber,
                t.dq ? 0 : s.totalPointsNp ?? 0,
                t.dq ? 0 : s.autoPoints ?? 0
            );
        }
        for (let i = 0; i < fillers; i++) {
            addTiebreakScore(scoresPerTeam, teamNumber, 0, 0);
        }
    }
}

function calculateTiebreakers(scores: TiebreakScores | undefined) {
    let np = scores?.np ?? [];
    let auto = scores?.auto ?? [];
    let sorted = [...np].sort((a, b) => b - a);
    return {
        averageNPMatchPoints: np.length ? np.reduce((a, b) => a + b, 0) / np.length : 0,
        averageAutoPoints: auto.length ? auto.reduce((a, b) => a + b, 0) / auto.length : 0,
        highestNPMatchPoints: sorted[0] ?? 0,
        secondHighestNPMatchPoints: sorted[1] ?? 0,
    };
}

async function computeDivisionParentTeamInfo(
    season: Season,
    parentEvent: Event,
    divisionEvents: Event[],
    config: AdvancementPointsConfig
): Promise<{
    teamInfoByTeam: Map<number, DivisionTeamInfo>;
    playoffPtsByTeam: Map<number, { points: number; isFinal: boolean }>;
    allianceTeams: Set<number>;
} | null> {
    let teamInfoByTeam = new Map<number, DivisionTeamInfo>();
    let playoffPtsByTeam = new Map<number, { points: number; isFinal: boolean }>();
    let allianceTeams = new Set<number>();

    let finalists: {
        divisionEventCode: string;
        alliances: AllianceApi[] | null;
        championAllianceNum: number;
    }[] = [];

    for (let divEvent of divisionEvents) {
        let [qualRows, teamCount, alliances] = await Promise.all([
            getQualRowsForEvent(season, divEvent),
            getTeamCountFromPlayedMatches(season, divEvent.code),
            getAlliances(season, divEvent.code),
        ]);

        let qualMatches = await Match.findBy({
            eventSeason: season,
            eventCode: divEvent.code,
            tournamentLevel: TournamentLevel.Quals,
        });
        let hasQuals = qualMatches.length > 0;
        let allQualsPlayed = hasQuals && qualMatches.every((m) => m.hasBeenPlayed);

        let playoffMatches = await getPlayoffMatchesForEvent(season, divEvent.code);
        let anyPlayoffMatch = playoffMatches.length > 0;
        if (!alliances && anyPlayoffMatch) {
            warnMissingAlliances(season, divEvent.code);
            return null;
        }

        // Alliance selection points
        let { alliancePoints, allianceTeams: thisDivisionAllianceTeams } =
            computeAllianceSelectionFromAlliances(alliances, config);
        thisDivisionAllianceTeams.forEach((t) => allianceTeams.add(t));
        let allianceSelectionFinal = anyPlayoffMatch || thisDivisionAllianceTeams.size > 0;

        qualRows = qualRows.filter((q) => {
            if (q.qualMatchesPlayed == null) return true;
            if (q.qualMatchesPlayed > 0) return true;
            return thisDivisionAllianceTeams.has(q.teamNumber);
        });

        if (alliances && playoffMatches.length > 0) {
            let { placementByAlliance, aliveAlliances } = await computeElimPlacementsByAlliance(
                season,
                divEvent.code,
                alliances,
                playoffMatches
            );

            applyDivisionPlayoffPoints(alliances, placementByAlliance, playoffPtsByTeam, config);

            let amountAlive = aliveAlliances.length;

            if (amountAlive === 1) {
                finalists.push({
                    divisionEventCode: divEvent.code,
                    alliances,
                    championAllianceNum: aliveAlliances[0],
                });
            }

            if (amountAlive === 1) {
                let aliveAlliance = aliveAlliances[0]!;
                let intermediatePoints = config.getPlayoffPoints(2);
                allianceTeamNumbers(alliances?.find((al) => al.number === aliveAlliance)!).forEach(
                    (n) => {
                        playoffPtsByTeam.set(n, { points: intermediatePoints, isFinal: false });
                    }
                );
            } else if (amountAlive! > 1) {
                aliveAlliances.forEach((a) => {
                    let intermediatePoints = config.getDivisionPlayoffPoints(
                        amountAlive as 2 | 3 | 4 | 5 | 6 | 7 | 8
                    );
                    allianceTeamNumbers(alliances?.find((al) => al.number === a)!).forEach((n) => {
                        playoffPtsByTeam.set(n, { points: intermediatePoints, isFinal: false });
                    });
                });
            }
        }

        let scoresPerTeam = new Map<number, TiebreakScores>();
        if (hasQuals) {
            let qualMatchIds = qualMatches.map((m) => m.id);
            let tmps = await TeamMatchParticipation.findBy({
                season,
                eventCode: divEvent.code,
                matchId: In(qualMatchIds),
            });
            let scores = await DATA_SOURCE.getRepository(MatchScoreSchemas[season]).findBy({
                season,
                eventCode: divEvent.code,
                matchId: In(qualMatchIds),
            });

            calculateScoresPerTeam(scores, tmps, scoresPerTeam);
        }

        for (let q of qualRows) {
            let qualPoints: number | null = null;
            if (q && teamCount > 0) {
                let qp = config.calculateQualPoints(q.rank, teamCount);
                qualPoints = Number.isFinite(qp) ? qp : null;
            }

            let isQualFinal = qualPoints != null && (allQualsPlayed || anyPlayoffMatch);
            let sel = alliancePoints.has(q.teamNumber) ? alliancePoints.get(q.teamNumber)! : null;
            let isAllianceSelectionFinal = allianceSelectionFinal;

            teamInfoByTeam.set(q.teamNumber, {
                qualPoints,
                isQualFinal,
                allianceSelectionPoints: sel,
                isAllianceSelectionFinal,
                tiebreakScores: scoresPerTeam.get(q.teamNumber),
            });
        }
    }

    await computeParentFinalistsPlayoffPoints(
        season,
        parentEvent.code,
        finalists,
        playoffPtsByTeam,
        config
    );

    return { teamInfoByTeam, playoffPtsByTeam, allianceTeams };
}

// Without the alliances, every team would get a final 0 for alliance selection and playoffs, so
// keep the event's earlier results until a later load can fetch them.
function warnMissingAlliances(season: Season, eventCode: string) {
    console.warn(
        `Couldn't fetch the alliances of ${eventCode} (${season}), not computing its advancement.`
    );
}

function getTeamAdvancementEligibility(
    teamNumber: number,
    teamRegionMap: Map<number, string>,
    qualEventCounts: Map<number, number>,
    previouslyAdvanced: Set<number>,
    event: Event,
    config: AdvancementPointsConfig
): AdvancementEligibility {
    let regionOk =
        event.regionCode == null ||
        !teamRegionMap.has(teamNumber) ||
        teamRegionMap.get(teamNumber) === event.regionCode;
    let playedCountOk = (qualEventCounts.get(teamNumber) ?? 0) < config.maxQualEvents;
    let notPreviouslyAdvanced = !previouslyAdvanced.has(teamNumber);
    return getAdvancementEligibility(regionOk, playedCountOk, notPreviouslyAdvanced);
}

export async function computeAdvancementForEvent(season: Season, eventCode: string) {
    if (season < 2025) return;

    let config = ADVANCEMENT_CONFIGS[season];
    if (!config) return;

    let event = await Event.findOneBy({ season, code: eventCode });
    if (!event) return;

    if (event.divisionCode) {
        console.info(`Computing advancement for division event ${event.code} (${season})...`);
        await computeAdvancementForEvent(season, event.divisionCode);
        return;
    }
    if (!SUPPORTED_EVENT_TYPES.includes(event.type as EventType)) return;

    console.info(`Computing advancement for event ${event.code} (${season})...`);

    let divisionEvents = await Event.findBy({ season, divisionCode: event.code });

    let qualMatches = await Match.findBy({
        eventSeason: season,
        eventCode,
        tournamentLevel: TournamentLevel.Quals,
    });
    let hasQuals = qualMatches.length > 0;
    let allQualsPlayed = hasQuals && qualMatches.every((m) => m.hasBeenPlayed);

    let playoffMatches = await DATA_SOURCE.getRepository(Match).find({
        where: [
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Semis },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Finals },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.DoubleElim },
        ],
    });
    let anyPlayoffMatch = playoffMatches.length > 0;

    if (divisionEvents.length === 2) {
        let divisionInfo = await computeDivisionParentTeamInfo(
            season,
            event,
            divisionEvents,
            config
        );
        if (!divisionInfo) return;
        let { teamInfoByTeam, playoffPtsByTeam, allianceTeams } = divisionInfo;

        let awards = await Award.findBy({ season, eventCode });
        let { awardsLoaded, awardPts } = computeAwardPointsMap(awards, config);

        let teamNumbers = new Set<number>();
        for (let t of teamInfoByTeam.keys()) teamNumbers.add(t);
        for (let t of playoffPtsByTeam.keys()) teamNumbers.add(t);
        awards.forEach((a) => teamNumbers.add(a.teamNumber));

        const teamNumberList = [...teamNumbers];
        let { teamRegionMap, qualEventCounts, previouslyAdvanced } = await loadEligibilityData(
            season,
            event,
            teamNumberList
        );

        let rows: TeamRow[] = [];
        for (let teamNumber of teamNumbers) {
            let info = teamInfoByTeam.get(teamNumber) ?? {
                qualPoints: null,
                isQualFinal: false,
                allianceSelectionPoints: null,
                isAllianceSelectionFinal: false,
            };

            let qualPoints = info.qualPoints;
            let isQualFinal = info.isQualFinal;

            let isAllianceSelectionFinal = info.isAllianceSelectionFinal;
            let sel = normalizeAllianceSelectionPoints(
                qualPoints,
                info.allianceSelectionPoints,
                isAllianceSelectionFinal
            );

            let playoff = playoffPtsByTeam.has(teamNumber)
                ? playoffPtsByTeam.get(teamNumber)!
                : null;
            if (qualPoints == null) {
                playoff = null;
            } else if (!allianceTeams.has(teamNumber) && isAllianceSelectionFinal) {
                playoff = { points: 0, isFinal: true };
            } else if (playoff == null && anyPlayoffMatch) {
                playoff = null;
            }

            let rawAward: number | null = awardPts.has(teamNumber)
                ? awardPts.get(teamNumber)!
                : null;
            let award = normalizeAwardPoints(awardsLoaded, rawAward);

            let total = sumTotalPoints(qualPoints, sel, playoff?.points ?? 0, award);

            let eligibility = getTeamAdvancementEligibility(
                teamNumber,
                teamRegionMap,
                qualEventCounts,
                previouslyAdvanced,
                event,
                config
            );

            rows.push({
                teamNumber,
                qualPoints,
                isQualFinal,
                allianceSelectionPoints: sel,
                isAllianceSelectionFinal,
                playoffPoints: playoff?.points ?? null,
                isPlayoffPointsFinal: playoff?.isFinal ?? false,
                awardPoints: award,
                totalPoints: total,
                rank: null,
                advancementRank: null,
                eligibility,
                advanced: false,
                ...calculateTiebreakers(info.tiebreakScores),
            });
        }

        sortRowsByTiebreak(rows, config);
        assignAdvancedSlots(event, rows);
        finalizeRowRanks(rows);
        await saveAdvancementRows(season, eventCode, rows);

        return;
    }

    let qualRows = await getQualRowsForEvent(season, event);

    let teamCount = await getTeamCountFromPlayedMatches(season, eventCode);

    let alliances = await getAlliances(season, eventCode);
    if (!alliances && anyPlayoffMatch) {
        warnMissingAlliances(season, eventCode);
        return;
    }
    let { alliancePoints, allianceTeams } = computeAllianceSelectionFromAlliances(
        alliances,
        config
    );

    let awards = await Award.findBy({ season, eventCode });
    let { awardsLoaded, awardPts } = computeAwardPointsMap(awards, config);

    let { playoffPts, playoffsComplete } = await computeNormalPlayoffPoints(
        season,
        eventCode,
        alliances,
        playoffMatches,
        config
    );

    let teamNumbers = new Set<number>();
    qualRows.forEach((q) => teamNumbers.add(q.teamNumber));
    alliances?.forEach((a) => {
        [a.captain, a.round1, a.round2, a.round3, a.backup].forEach((n) => {
            if (typeof n?.teamNumber === "number") teamNumbers.add(n.teamNumber);
        });
    });
    awards.forEach((a) => teamNumbers.add(a.teamNumber));

    const teamNumberList = [...teamNumbers];
    let { teamRegionMap, qualEventCounts, previouslyAdvanced } = await loadEligibilityData(
        season,
        event,
        teamNumberList
    );

    let scoresPerTeam = new Map<number, TiebreakScores>();
    if (event.type == EventType.LeagueTournament && event.leagueCode) {
        let selection = await loadLeagueSelection(season, event.leagueCode, event.regionCode);
        if (selection) calculateLeagueScoresPerTeam(selection, teamNumberList, scoresPerTeam);
    } else if (hasQuals) {
        let qualMatchIds = qualMatches.map((m) => m.id);
        let tmps = await TeamMatchParticipation.findBy({
            season,
            eventCode: eventCode,
            matchId: In(qualMatchIds),
        });
        let scores = await DATA_SOURCE.getRepository(MatchScoreSchemas[season]).findBy({
            season,
            eventCode: eventCode,
            matchId: In(qualMatchIds),
        });

        calculateScoresPerTeam(scores, tmps, scoresPerTeam);
    }

    let allianceSelectionFinal = anyPlayoffMatch || allianceTeams.size > 0;
    let rows: TeamRow[] = [];
    for (let teamNumber of teamNumbers) {
        let rankEntry = qualRows.find((q) => q.teamNumber == teamNumber);
        let qualPoints: number | null = null;
        if (rankEntry && teamCount > 0 && rankEntry.rank != null && rankEntry.rank > 0) {
            let qp = config.calculateQualPoints(rankEntry.rank, teamCount);

            qualPoints = Number.isFinite(qp) ? qp : null;
        }

        let isQualFinal = !!qualPoints && (allQualsPlayed || anyPlayoffMatch);

        let isAllianceSelectionFinal = allianceSelectionFinal;
        let sel = normalizeAllianceSelectionPoints(
            qualPoints,
            alliancePoints.has(teamNumber) ? alliancePoints.get(teamNumber)! : null,
            isAllianceSelectionFinal
        );

        let playoff = playoffPts.has(teamNumber) ? playoffPts.get(teamNumber)! : null;
        if (qualPoints == null) {
            playoff = null;
        } else if (!allianceTeams.has(teamNumber) && allianceSelectionFinal) {
            playoff = { points: 0, isFinal: true };
        } else if (playoffsComplete && playoff == null) {
            playoff = { points: 0, isFinal: true };
        }
        let rawAward: number | null = awardPts.has(teamNumber) ? awardPts.get(teamNumber)! : null;
        let award = normalizeAwardPoints(awardsLoaded, rawAward);
        let total = sumTotalPoints(qualPoints, sel, playoff?.points ?? 0, award);

        let eligibility = getTeamAdvancementEligibility(
            teamNumber,
            teamRegionMap,
            qualEventCounts,
            previouslyAdvanced,
            event,
            config
        );

        rows.push({
            teamNumber,
            qualPoints,
            isQualFinal,
            allianceSelectionPoints: sel,
            isAllianceSelectionFinal,
            playoffPoints: playoff?.points ?? null,
            isPlayoffPointsFinal: playoff?.isFinal ?? false,
            awardPoints: award,
            totalPoints: total,
            rank: null,
            advancementRank: null,
            eligibility,
            advanced: false,
            ...calculateTiebreakers(scoresPerTeam.get(teamNumber)),
        });
    }

    sortRowsByTiebreak(rows, config);
    assignAdvancedSlots(event, rows);
    finalizeRowRanks(rows);

    await saveAdvancementRows(season, eventCode, rows);
}
