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
import { getAlliances } from "../../ftc-api/get-alliances";
import { LeagueRankingSchemas } from "../entities/dyn/league-ranking";
import { TeamMatchParticipation } from "../entities/TeamMatchParticipation";
import { MatchScoreSchemas } from "../entities/dyn/match-score";
import { In } from "typeorm";

const SUPPORTED_EVENT_TYPES: EventType[] = [
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.SuperQualifier,
    EventType.Championship,
    EventType.FIRSTChampionship,
];

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
};

export async function computeAdvancementForEvent(season: Season, eventCode: string) {
    if (season < 2025) return;

    let event = await Event.findOneBy({ season, code: eventCode });
    if (!event) return;

    // Skip dual-division events for now
    if (event.divisionCode) return;
    if (!SUPPORTED_EVENT_TYPES.includes(event.type as EventType)) return;

    // Determine quals are final
    let qualMatches = await Match.findBy({
        eventSeason: season,
        eventCode,
        tournamentLevel: TournamentLevel.Quals,
    });
    let hasQuals = qualMatches.length > 0;
    let allQualsPlayed = hasQuals && qualMatches.every((m) => m.hasBeenPlayed);

    // Determine playoff presence/completion
    let playoffMatches = await DATA_SOURCE.getRepository(Match).find({
        where: [
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Semis },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.Finals },
            { eventSeason: season, eventCode, tournamentLevel: TournamentLevel.DoubleElim },
        ],
    });
    let anyPlayoffMatch = playoffMatches.length > 0;

    // Qual points source (league tournaments use league ranking)
    let qualRows: { teamNumber: number; rank: number }[] = [];
    if (event.type == EventType.LeagueTournament && event.leagueCode) {
        let leagueRanks = await DATA_SOURCE.getRepository(LeagueRankingSchemas[season]).find({
            where: { leagueCode: event.leagueCode },
        });
        qualRows = leagueRanks.map((lr) => ({ teamNumber: lr.teamNumber, rank: lr.rank }));
    } else {
        let teps = await DATA_SOURCE.getRepository(TeamEventParticipationSchemas[season]).findBy({
            season,
            eventCode,
        });
        qualRows = teps.map((t) => ({ teamNumber: t.teamNumber, rank: t.rank }));
    }

    // Filter out teams that are not in the TEP list for this event (specifically for League Tournaments)
    // For non-league tournaments, qualRows comes from TEP anyway, so this is a no-op.
    // For League Tournaments, qualRows comes from LeagueRanking, which might include teams not at this event.
    if (event.type == EventType.LeagueTournament) {
        let eventTeps = await DATA_SOURCE.getRepository(
            TeamEventParticipationSchemas[season]
        ).findBy({
            season,
            eventCode,
        });
        let eventTeamNumbers = new Set(eventTeps.map((t) => t.teamNumber));
        qualRows = qualRows.filter((q) => eventTeamNumbers.has(q.teamNumber));
    }

    // Team Count: Count teams that have played at least one match at the event
    let teamsWithMatches = await DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("match")
        .leftJoinAndSelect("match.teams", "teampart")
        .where("match.eventSeason = :season", { season })
        .andWhere("match.eventCode = :eventCode", { eventCode })
        .andWhere("match.hasBeenPlayed = true")
        .select("teampart.teamNumber")
        .distinct(true)
        .getRawMany();

    let teamCount = teamsWithMatches.length;

    // Alliance selection
    let alliances = await getAlliances(season, eventCode);
    let alliancePoints = new Map<number, number>();
    if (alliances) {
        for (let alliance of alliances) {
            let leadPts = ALLIANCE_SELECTION_BASE_2025 - alliance.number;
            if (alliance.captain != null) alliancePoints.set(alliance.captain, leadPts);
            let draft1Pts = ALLIANCE_SELECTION_BASE_2025 - alliance.number;
            if (alliance.round1 != null) alliancePoints.set(alliance.round1, draft1Pts);
            if (alliance.round2 != null)
                alliancePoints.set(alliance.round2, ALLIANCE_SELECTION_BASE_2025 - alliance.number);
            if (alliance.round3 != null)
                alliancePoints.set(alliance.round3, ALLIANCE_SELECTION_BASE_2025 - alliance.number);
            if (alliance.backup != null)
                alliancePoints.set(alliance.backup, ALLIANCE_SELECTION_BASE_2025 - alliance.number);
        }
    }

    // Awards
    let awards = await Award.findBy({ season, eventCode });
    let awardsLoaded = awards.length > 0;
    let awardPts = new Map<number, number>();
    for (let aw of awards) {
        // Ignore playoff result awards for advancement judged-award scoring.
        if (aw.type == AwardType.Winner || aw.type == AwardType.Finalist) continue;

        let inc = 0;
        if (aw.type == AwardType.Inspire) {
            inc = INSPIRE_POINTS_2025[aw.placement as 1 | 2 | 3] ?? 0;
        } else {
            inc = OTHER_AWARD_POINTS_2025[aw.placement as 1 | 2 | 3] ?? 0;
        }
        // Teams should only receive points for their single highest award; don't stack multiples.
        let existing = awardPts.get(aw.teamNumber) ?? 0;
        awardPts.set(aw.teamNumber, Math.max(existing, inc));
    }

    // Playoff points (double-elim style; supports finals/semis brackets too)
    let playoffPts = new Map<number, number>();
    let playoffsComplete = false;

    if (playoffMatches.length > 0) {
        playoffsComplete = playoffMatches.every((m) => m.hasBeenPlayed);

        // Map team -> alliance number from selection data
        let teamToAlliance = new Map<number, number>();
        alliances?.forEach((a) => {
            [a.captain, a.round1, a.round2, a.round3, a.backup].forEach((n) => {
                if (typeof n === "number") teamToAlliance.set(n, a.number);
            });
        });

        // Load teams and scores for playoff matches
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
        teamToAlliance.forEach((num) => {
            allianceResults.set(num, { allianceNum: num, losses: 0 });
        });

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

        // Process matches chronologically (by id) to build elimination order
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

            let redWins = redScore > blueScore;
            let winner = redWins ? redAlliance : blueAlliance;
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

            if (!allianceResults.has(winner)) {
                allianceResults.set(winner, { allianceNum: winner, losses: 0 });
            }
        }

        // Determine placements based on elimination order
        let alive = [...allianceResults.values()].filter((r) => r.eliminatedAt == null);
        let eliminated = [...allianceResults.values()].filter((r) => r.eliminatedAt != null);
        eliminated.sort((a, b) => (a.eliminatedAt ?? 0) - (b.eliminatedAt ?? 0));

        let placements: number[] = [];
        if (alive.length == 1) {
            placements.push(alive[0].allianceNum);
        }
        placements.push(...eliminated.map((r) => r.allianceNum).reverse());

        function setPlacement(allianceNum: number, placement: 1 | 2 | 3 | 4) {
            let points = PLAYOFF_POINTS_2025[placement];
            let alliance = alliances?.find((a) => a.number == allianceNum);
            if (!alliance) return;
            [
                alliance.captain,
                alliance.round1,
                alliance.round2,
                alliance.round3,
                alliance.backup,
            ].forEach((n) => {
                if (typeof n === "number") playoffPts.set(n, points);
            });
        }

        if (placements[0] != null) setPlacement(placements[0], 1);
        if (placements[1] != null) setPlacement(placements[1], 2);
        if (placements[2] != null) setPlacement(placements[2], 3);
        if (placements[3] != null) setPlacement(placements[3], 4);

        if (playoffsComplete) {
            alliances?.forEach((a) => {
                [a.captain, a.round1, a.round2, a.round3, a.backup].forEach((n) => {
                    if (typeof n === "number" && !playoffPts.has(n)) playoffPts.set(n, 0);
                });
            });
        }
    }

    // Collate all team numbers
    let teamNumbers = new Set<number>();
    qualRows.forEach((q) => teamNumbers.add(q.teamNumber));
    alliances?.forEach((a) => {
        [a.captain, a.round1, a.round2, a.round3, a.backup].forEach((n) => {
            if (typeof n === "number") teamNumbers.add(n);
        });
    });
    awards.forEach((a) => teamNumbers.add(a.teamNumber));

    let rows: TeamRow[] = [];
    for (let teamNumber of teamNumbers) {
        let rankEntry = qualRows.find((q) => q.teamNumber == teamNumber);
        let qualPoints: number | null = null;
        // Calculate qual points if we have a rank and a team count (even if not final)
        if (rankEntry && teamCount > 0) {
            let qp = qualPoints2025(rankEntry.rank, teamCount);
            qualPoints = Number.isFinite(qp) ? qp : null;
        }
        // Treat quals as final once all qual matches are played or playoff matches are scheduled.
        let isQualFinal = !!qualPoints && (allQualsPlayed || anyPlayoffMatch);

        let sel = alliancePoints.has(teamNumber) ? alliancePoints.get(teamNumber)! : null;
        let isAllianceSelectionFinal = anyPlayoffMatch;
        if (!isAllianceSelectionFinal && sel == null) {
            sel = null; // N/A while in progress
        }
        if (isAllianceSelectionFinal && sel == null) {
            sel = 0; // unselected after final selection
        }

        let playoff = playoffPts.has(teamNumber) ? playoffPts.get(teamNumber)! : null;
        if (playoffsComplete && playoff == null) {
            playoff = 0; // playoffs finished; unplaced teams get 0
        }
        let award: number | null = awardPts.has(teamNumber) ? awardPts.get(teamNumber)! : null;
        if (awardsLoaded && award == null) {
            award = 0; // awards have been published; teams without one get 0
        }
        let total = (qualPoints ?? 0) + (sel ?? 0) + (playoff ?? 0) + (award ?? 0);

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
        });
    }

    // Rank teams using tie-break order (first five only)
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

    rows.forEach((r, i) => {
        r.totalPoints = r.totalPoints ?? 0;
        r.rank = i + 1;
    });

    await DATA_SOURCE.transaction(async (em) => {
        // Delete existing scores for teams that are no longer in the list (e.g. filtered out)
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
            await em.save(existing);
        }
    });
}
