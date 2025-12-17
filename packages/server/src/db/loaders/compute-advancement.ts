import {
    ALLIANCE_SELECTION_BASE_2025,
    INSPIRE_POINTS_2025,
    OTHER_AWARD_POINTS_2025,
    PLAYOFF_POINTS_2025,
    Alliance,
    Season,
    TournamentLevel,
    EventType,
    qualPoints2025,
} from "@ftc-scout/common";
import { AdvancementScore } from "../entities/AdvancementScore";
import { Event } from "../entities/Event";
import { DATA_SOURCE } from "../data-source";
import { TeamEventParticipationSchemas } from "../entities/dyn/team-event-participation";
import { Match } from "../entities/Match";
import { Award, AwardType } from "../entities/Award";
import { getAlliances, type AllianceApi } from "../../ftc-api/get-alliances";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { MatchScoreSchemas } from "../entities/dyn/match-score";
import { Team } from "../entities/Team";
import { In } from "typeorm";

const SUPPORTED_EVENT_TYPES: EventType[] = [
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.SuperQualifier,
    EventType.Championship,
    EventType.FIRSTChampionship,
];

const QUALIFYING_EVENT_TYPES: EventType[] = [EventType.Qualifier, EventType.LeagueTournament];

type TeamRow = {
    teamNumber: number;
    qualPoints: number | null;
    isQualFinal: boolean;
    allianceSelectionPoints: number | null;
    isAllianceSelectionFinal: boolean;
    playoffPoints: number | null;
    awardPoints: number | null;
    totalPoints: number | null;
    rank: number | null;
    isAdvancementEligible: boolean;
    advanced: boolean;
};

type QualRow = { teamNumber: number; rank: number; qualMatchesPlayed?: number };

type DivisionTeamInfo = {
    qualPoints: number | null;
    isQualFinal: boolean;
    allianceSelectionPoints: number | null;
    isAllianceSelectionFinal: boolean;
};

const ADVANCEMENT_JUDGED_AWARD_TYPES_2025 = new Set<AwardType>([
    AwardType.Inspire,
    AwardType.JudgesChoice,
    AwardType.Control,
    AwardType.Motivate,
    AwardType.Reach,
    AwardType.Sustain,
    AwardType.Design,
    AwardType.Innovate,
    AwardType.Connect,
    AwardType.Think,
]);

function isJudgedAwardForAdvancement2025(type: AwardType): boolean {
    return ADVANCEMENT_JUDGED_AWARD_TYPES_2025.has(type);
}

function allianceTeamNumbers(a: AllianceApi): number[] {
    return [a.captain, a.round1, a.round2, a.round3, a.backup].filter(
        (n): n is number => typeof n === "number"
    );
}

function awardPointsForDivisionPlacement(placement: number): number | null {
    if (placement === 2) return 10;
    if (placement === 3) return 5;
    return 0;
}

function computeAwardPointsMap(awards: Award[]): {
    awardsLoaded: boolean;
    awardPts: Map<number, number>;
} {
    let awardsLoaded = awards.length > 0;
    let awardPts = new Map<number, number>();

    for (let aw of awards) {
        if (!isJudgedAwardForAdvancement2025(aw.type)) continue;

        let inc = 0;
        if (aw.type == AwardType.Inspire) {
            inc = INSPIRE_POINTS_2025[aw.placement as 1 | 2 | 3] ?? 0;
        } else {
            inc = OTHER_AWARD_POINTS_2025[aw.placement as 1 | 2 | 3] ?? 0;
        }

        let existing = awardPts.get(aw.teamNumber) ?? 0;
        awardPts.set(aw.teamNumber, Math.max(existing, inc));
    }

    return { awardsLoaded, awardPts };
}

function computeAllianceSelectionFromAlliances(alliances: AllianceApi[] | null): {
    alliancePoints: Map<number, number>;
    allianceTeams: Set<number>;
} {
    let alliancePoints = new Map<number, number>();
    let allianceTeams = new Set<number>();
    if (!alliances) return { alliancePoints, allianceTeams };

    for (let alliance of alliances) {
        let pts = ALLIANCE_SELECTION_BASE_2025 - alliance.number;
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
    if (event.type == EventType.LeagueTournament && event.leagueCode) {
        let leagueRanks = await DATA_SOURCE.getRepository(LeagueRankingSchemas[season]).find({
            where: { leagueCode: event.leagueCode },
        });
        let rows = leagueRanks.map((lr) => ({ teamNumber: lr.teamNumber, rank: lr.rank }));

        let eventTeps = await DATA_SOURCE.getRepository(
            TeamEventParticipationSchemas[season]
        ).findBy({
            season,
            eventCode: event.code,
        });
        let eventTeamNumbers = new Set(eventTeps.map((t) => t.teamNumber));
        return rows.filter((q) => eventTeamNumbers.has(q.teamNumber));
    }

    let teps = await DATA_SOURCE.getRepository(TeamEventParticipationSchemas[season]).findBy({
        season,
        eventCode: event.code,
    });
    return teps.map((t) => ({
        teamNumber: t.teamNumber,
        rank: t.rank,
        qualMatchesPlayed: (t as any).qualMatchesPlayed ?? undefined,
    }));
}

async function getTeamCountFromPlayedMatches(season: Season, eventCode: string): Promise<number> {
    let teamsWithMatches = await DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("match")
        .leftJoinAndSelect("match.teams", "teampart")
        .where("match.eventSeason = :season", { season })
        .andWhere("match.eventCode = :eventCode", { eventCode })
        .andWhere("match.hasBeenPlayed = true")
        .select("teampart.teamNumber")
        .distinct(true)
        .getRawMany();

    return teamsWithMatches.length;
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
    teamRegionMap: Map<number, string | null>;
    qualEventCounts: Map<number, number>;
    previouslyAdvanced: Set<number>;
}> {
    const teamRegionMap = new Map<number, string | null>();
    const qualEventCounts = new Map<number, number>();
    const previouslyAdvanced = new Set<number>();

    if (teamNumberList.length === 0) return { teamRegionMap, qualEventCounts, previouslyAdvanced };

    let teams = await Team.createQueryBuilder("team")
        .select(["team.number", "team.regionCode"])
        .where("team.number IN (:...teamNumbers)", { teamNumbers: teamNumberList })
        .getMany();
    teams.forEach((t) => teamRegionMap.set(t.number, t.regionCode ?? null));

    let qualCountRows = await DATA_SOURCE.getRepository(TeamEventParticipationSchemas[season])
        .createQueryBuilder("tep")
        .innerJoin(Event, "e", "tep.season = e.season AND tep.eventCode = e.code")
        .where("tep.season = :season", { season })
        .andWhere("tep.teamNumber IN (:...teamNumbers)", { teamNumbers: teamNumberList })
        .andWhere("e.type IN (:...types)", { types: QUALIFYING_EVENT_TYPES })
        .andWhere("e.end < :eventStart", { eventStart: event.start })
        .select("tep.teamNumber", "teamNumber")
        .addSelect("COUNT(DISTINCT tep.eventCode)", "cnt")
        .groupBy("tep.teamNumber")
        .getRawMany();
    qualCountRows.forEach((row: any) => {
        qualEventCounts.set(Number(row.teamNumber), Number(row.cnt));
    });

    let priorAdvRows = await DATA_SOURCE.getRepository(AdvancementScore)
        .createQueryBuilder("as")
        .innerJoin(Event, "e", "as.season = e.season AND as.eventCode = e.code")
        .where("as.season = :season", { season })
        .andWhere("as.teamNumber IN (:...teamNumbers)", { teamNumbers: teamNumberList })
        .andWhere("as.advanced = true")
        .andWhere("e.type IN (:...types)", { types: QUALIFYING_EVENT_TYPES })
        .andWhere("e.end < :eventStart", { eventStart: event.start })
        .select("as.teamNumber", "teamNumber")
        .getRawMany();
    priorAdvRows.forEach((row: any) => previouslyAdvanced.add(Number(row.teamNumber)));

    return { teamRegionMap, qualEventCounts, previouslyAdvanced };
}

function applyEligibilityToRows(
    event: Event,
    teamRegionMap: Map<number, string | null>,
    qualEventCounts: Map<number, number>,
    previouslyAdvanced: Set<number>,
    rows: TeamRow[]
) {
    for (let r of rows) {
        let regionOk =
            event.regionCode == null ||
            !teamRegionMap.has(r.teamNumber) ||
            teamRegionMap.get(r.teamNumber) === event.regionCode;
        let playedCountOk = (qualEventCounts.get(r.teamNumber) ?? 0) < 3;
        let notPreviouslyAdvanced = !previouslyAdvanced.has(r.teamNumber);
        r.isAdvancementEligible = regionOk && playedCountOk && notPreviouslyAdvanced;
    }
}

function sortRowsByTiebreak2025(rows: TeamRow[]) {
    rows.sort((a, b) => {
        if ((b.totalPoints ?? 0) != (a.totalPoints ?? 0))
            return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
        if ((b.awardPoints ?? 0) != (a.awardPoints ?? 0))
            return (b.awardPoints ?? 0) - (a.awardPoints ?? 0);
        if ((b.playoffPoints ?? 0) != (a.playoffPoints ?? 0))
            return (b.playoffPoints ?? 0) - (a.playoffPoints ?? 0);
        if ((b.allianceSelectionPoints ?? 0) != (a.allianceSelectionPoints ?? 0))
            return (b.allianceSelectionPoints ?? 0) - (a.allianceSelectionPoints ?? 0);
        if ((b.qualPoints ?? 0) != (a.qualPoints ?? 0))
            return (b.qualPoints ?? 0) - (a.qualPoints ?? 0);
        return 0;
    });
}

function assignAdvancedSlots(event: Event, rows: TeamRow[]) {
    if ((event.advancementSlots ?? 0) <= 0) return;
    if (!QUALIFYING_EVENT_TYPES.includes(event.type as EventType)) return;

    let eligibleRows = rows.filter((r) => r.isAdvancementEligible);
    let advSlots = Math.min(event.advancementSlots ?? 0, eligibleRows.length);
    for (let i = 0; i < advSlots; i++) {
        eligibleRows[i].advanced = true;
    }
}

function finalizeRowRanks(rows: TeamRow[]) {
    rows.forEach((r, i) => {
        r.totalPoints = r.totalPoints ?? 0;
        r.rank = i + 1;
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
            existing.awardPoints = r.awardPoints;
            existing.totalPoints = r.totalPoints;
            existing.rank = (r as any).rank ?? null;
            existing.isAdvancementEligible = r.isAdvancementEligible;
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
    placementByAlliance: Map<number, number>;
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
    alliances.forEach((a) => allianceResults.set(a.number, { allianceNum: a.number, losses: 0 }));

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

        let redScore = scoreFor(m.id, Alliance.Red);
        let blueScore = scoreFor(m.id, Alliance.Blue);
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
    let placementByAlliance = new Map<number, number>();
    eliminated.forEach((r, idx) => {
        placementByAlliance.set(r.allianceNum, allianceCount - idx);
    });

    return { placementByAlliance, aliveAlliances: alive.map((r) => r.allianceNum) };
}

function applyPlayoffPointsToAlliance(
    alliances: AllianceApi[] | null,
    allianceNum: number,
    points: number,
    playoffPts: Map<number, number>
) {
    let alliance = alliances?.find((a) => a.number == allianceNum);
    if (!alliance) return;
    allianceTeamNumbers(alliance).forEach((n) => playoffPts.set(n, points));
}

async function computeNormalPlayoffPoints(
    season: Season,
    eventCode: string,
    alliances: AllianceApi[] | null,
    playoffMatches: Match[]
): Promise<{ playoffPts: Map<number, number>; playoffsComplete: boolean }> {
    let playoffPts = new Map<number, number>();
    if (!alliances || alliances.length === 0 || playoffMatches.length === 0) {
        return { playoffPts, playoffsComplete: false };
    }

    let playoffsComplete = playoffMatches.every((m) => m.hasBeenPlayed);
    let { placementByAlliance, aliveAlliances } = await computeElimPlacementsByAlliance(
        season,
        eventCode,
        alliances,
        playoffMatches
    );

    if (playoffsComplete && aliveAlliances.length === 1) {
        placementByAlliance.set(aliveAlliances[0]!, 1);
    }

    for (let [allianceNum, placement] of placementByAlliance.entries()) {
        if ((placement === 1 || placement === 2) && !playoffsComplete) continue;

        let points = 0;
        if (placement >= 1 && placement <= 4) {
            points = PLAYOFF_POINTS_2025[placement as 1 | 2 | 3 | 4] ?? 0;
        }
        applyPlayoffPointsToAlliance(alliances, allianceNum, points, playoffPts);
    }

    if (playoffsComplete) {
        alliances.forEach((a) => {
            allianceTeamNumbers(a).forEach((n) => {
                if (!playoffPts.has(n)) playoffPts.set(n, 0);
            });
        });
    }

    return { playoffPts, playoffsComplete };
}

function applyDivisionPlayoffPoints(
    alliances: AllianceApi[] | null,
    placementByAlliance: Map<number, number>,
    playoffPts: Map<number, number>
) {
    for (let [allianceNum, placement] of placementByAlliance.entries()) {
        if (placement === 1) continue; // Division winner gets 40/20 from parent finals.
        let pts = awardPointsForDivisionPlacement(placement);
        if (pts == null) continue;
        applyPlayoffPointsToAlliance(alliances, allianceNum, pts, playoffPts);
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
    playoffPts: Map<number, number>
) {
    if (finalists.length !== 2) return;

    // Resolve finalist team sets from their division champion alliances.
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

    winnerTeamSet.forEach((t) => playoffPts.set(t, 40));
    loserTeamSet.forEach((t) => playoffPts.set(t, 20));
}

async function computeDivisionParentTeamInfo(
    season: Season,
    parentEvent: Event,
    divisionEvents: Event[]
): Promise<{
    teamInfoByTeam: Map<number, DivisionTeamInfo>;
    playoffPtsByTeam: Map<number, number>;
    allianceTeams: Set<number>;
}> {
    let teamInfoByTeam = new Map<number, DivisionTeamInfo>();
    let playoffPtsByTeam = new Map<number, number>();
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

        // Alliance selection points
        let { alliancePoints, allianceTeams: thisDivisionAllianceTeams } =
            computeAllianceSelectionFromAlliances(alliances);
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

            applyDivisionPlayoffPoints(alliances, placementByAlliance, playoffPtsByTeam);

            if (aliveAlliances.length === 1) {
                finalists.push({
                    divisionEventCode: divEvent.code,
                    alliances,
                    championAllianceNum: aliveAlliances[0],
                });
            }
        }

        for (let q of qualRows) {
            let qualPoints: number | null = null;
            if (q && teamCount > 0) {
                let qp = qualPoints2025(q.rank, teamCount);
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
            });
        }
    }

    await computeParentFinalistsPlayoffPoints(
        season,
        parentEvent.code,
        finalists,
        playoffPtsByTeam
    );

    return { teamInfoByTeam, playoffPtsByTeam, allianceTeams };
}

export async function computeAdvancementForEvent(season: Season, eventCode: string) {
    if (season < 2025) return;

    let event = await Event.findOneBy({ season, code: eventCode });
    if (!event) return;

    if (event.divisionCode) {
        await computeAdvancementForEvent(season, event.divisionCode);
        return;
    }
    if (!SUPPORTED_EVENT_TYPES.includes(event.type as EventType)) return;

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
        let { teamInfoByTeam, playoffPtsByTeam, allianceTeams } =
            await computeDivisionParentTeamInfo(season, event, divisionEvents);

        let awards = await Award.findBy({ season, eventCode });
        let { awardsLoaded, awardPts } = computeAwardPointsMap(awards);

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
                playoff = 0;
            } else if (playoff == null && anyPlayoffMatch) {
                playoff = null;
            }

            let rawAward: number | null = awardPts.has(teamNumber)
                ? awardPts.get(teamNumber)!
                : null;
            let award = normalizeAwardPoints(awardsLoaded, rawAward);

            let total = sumTotalPoints(qualPoints, sel, playoff, award);

            rows.push({
                teamNumber,
                qualPoints,
                isQualFinal,
                allianceSelectionPoints: sel,
                isAllianceSelectionFinal,
                playoffPoints: playoff,
                awardPoints: award,
                totalPoints: total,
                rank: null,
                isAdvancementEligible: true,
                advanced: false,
            });
        }

        applyEligibilityToRows(event, teamRegionMap, qualEventCounts, previouslyAdvanced, rows);
        sortRowsByTiebreak2025(rows);
        assignAdvancedSlots(event, rows);
        finalizeRowRanks(rows);
        await saveAdvancementRows(season, eventCode, rows);

        return;
    }

    let qualRows = await getQualRowsForEvent(season, event);

    let teamCount = await getTeamCountFromPlayedMatches(season, eventCode);

    let alliances = await getAlliances(season, eventCode);
    let { alliancePoints, allianceTeams } = computeAllianceSelectionFromAlliances(alliances);

    let awards = await Award.findBy({ season, eventCode });
    let { awardsLoaded, awardPts } = computeAwardPointsMap(awards);

    let { playoffPts, playoffsComplete } = await computeNormalPlayoffPoints(
        season,
        eventCode,
        alliances,
        playoffMatches
    );

    let teamNumbers = new Set<number>();
    qualRows.forEach((q) => teamNumbers.add(q.teamNumber));
    alliances?.forEach((a) => {
        [a.captain, a.round1, a.round2, a.round3, a.backup].forEach((n) => {
            if (typeof n === "number") teamNumbers.add(n);
        });
    });
    awards.forEach((a) => teamNumbers.add(a.teamNumber));

    const teamNumberList = [...teamNumbers];
    let { teamRegionMap, qualEventCounts, previouslyAdvanced } = await loadEligibilityData(
        season,
        event,
        teamNumberList
    );

    let allianceSelectionFinal = anyPlayoffMatch || allianceTeams.size > 0;
    let rows: TeamRow[] = [];
    for (let teamNumber of teamNumbers) {
        let rankEntry = qualRows.find((q) => q.teamNumber == teamNumber);
        let qualPoints: number | null = null;
        if (rankEntry && teamCount > 0) {
            let qp = qualPoints2025(rankEntry.rank, teamCount);
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
            playoff = 0;
        } else if (playoffsComplete && playoff == null) {
            playoff = 0;
        }
        let rawAward: number | null = awardPts.has(teamNumber) ? awardPts.get(teamNumber)! : null;
        let award = normalizeAwardPoints(awardsLoaded, rawAward);
        let total = sumTotalPoints(qualPoints, sel, playoff, award);

        rows.push({
            teamNumber,
            qualPoints,
            isQualFinal,
            allianceSelectionPoints: sel,
            isAllianceSelectionFinal,
            playoffPoints: playoff,
            awardPoints: award,
            totalPoints: total,
            rank: null,
            isAdvancementEligible: true,
            advanced: false,
        });
    }

    applyEligibilityToRows(event, teamRegionMap, qualEventCounts, previouslyAdvanced, rows);
    sortRowsByTiebreak2025(rows);
    assignAdvancedSlots(event, rows);
    finalizeRowRanks(rows);
    await saveAdvancementRows(season, eventCode, rows);
}
