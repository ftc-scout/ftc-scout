import { Season } from "../Season";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import {
    type Match,
    type Tep,
    createEmptyTep,
    createEmptyGroup,
    filterQualsMatches,
    calculateGroupStats,
    calculateOprs,
    calculateRp,
    calculateTiebreakers,
    calcLosingScoreTb,
    determineWinner,
    hasAllianceScores,
} from "./shared-stats-utils";

export type FrontendMatch = Match;

export function calculateTeamEventStats(
    season: Season,
    eventCode: string,
    isRemote: boolean,
    matches: FrontendMatch[],
    teams: number[]
): Tep[] {
    matches = filterQualsMatches(matches);

    let descriptor = DESCRIPTORS[season];
    let emptyGroup = createEmptyGroup(descriptor);

    let teps = {} as Record<number, Tep>;
    teams.forEach(
        (t) => (teps[t] = createEmptyTep<Tep>(season, eventCode, t, isRemote, emptyGroup))
    );

    (isRemote ? calculateRemoteMatchesPlayed : calculateRecords)(matches, teps);
    calculateGroupStats(matches, teps, descriptor, isRemote);
    calculateOprs(matches, teps, isRemote, descriptor);
    calculateRanks(teps, matches, descriptor);

    return Object.values(teps);
}

function calculateRecords(matches: FrontendMatch[], teps: Record<number, Tep>) {
    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;
        let red = m.scores.red;
        let blue = m.scores.blue;
        let winningAlliance = determineWinner(red, blue);

        for (let t of m.teams) {
            if (t.surrogate) continue;

            let r = teps[t.teamNumber];
            r.qualMatchesPlayed++;
            r.hasStats = true;
            if (t.dq) {
                r.dqs++;
                r.losses++;
                continue;
            }
            if (t.alliance == winningAlliance) {
                r.wins++;
            } else if (winningAlliance == null) {
                r.ties++;
            } else {
                r.losses++;
            }
        }
    }
}

function calculateRemoteMatchesPlayed(matches: FrontendMatch[], teps: Record<number, Tep>) {
    for (let m of matches) {
        let t = m.teams[0];
        if (t.onField) {
            teps[t.teamNumber].qualMatchesPlayed++;
            teps[t.teamNumber].hasStats = true;
        }
    }
}

function calculateRanks(teps: Record<number, Tep>, matches: FrontendMatch[], descriptor: any) {
    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;
        stats.rp = calculateRp(stats, descriptor);
    }

    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        if (descriptor.rankings.tb === "LosingScore") {
            let result = calcLosingScoreTb(teps, matches);
            let totals = result[stats.teamNumber];
            let sum = totals?.sum ?? 0;
            let denom = totals?.denom ?? 0;
            stats.tb1 = denom == 0 ? 0 : sum / denom;
            stats.tb2 = 0;
        } else {
            let { tb1, tb2 } = calculateTiebreakers(stats, descriptor);
            stats.tb1 = tb1;
            stats.tb2 = tb2;
        }
    }

    let ranked = Object.entries(teps)
        .filter(([_, s]) => s.hasStats)
        .sort(([_1, s1], [_2, s2]) => s2.tb2 - s1.tb2)
        .sort(([_1, s1], [_2, s2]) => s2.tb1 - s1.tb1)
        .sort(([_1, s1], [_2, s2]) => s2.rp - s1.rp);

    for (let rank = 0; rank < ranked.length; rank++) {
        teps[+ranked[rank][0]].rank = rank + 1;
    }
}
