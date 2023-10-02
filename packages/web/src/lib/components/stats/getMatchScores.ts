import { Alliance, type FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
import type { AllianceScore } from "../../../routes/events/[season=season]/[code]/[tab=event_tab]/Insights.svelte";

export function getMatchScores(m: FullMatchFragment): AllianceScore[] {
    if (!m.scores) return [];
    if ("red" in m.scores) {
        let r = { ...m.scores.red };
        let b = { ...m.scores.blue };
        (r as any).opponentsScore = b;
        (r as any).match = m;
        (r as any).teams = m.teams.filter((t) => t.alliance == Alliance.Red);
        (b as any).opponentsScore = r;
        (b as any).match = m;
        (b as any).teams = m.teams.filter((t) => t.alliance == Alliance.Blue);
        return [r, b];
    } else {
        let s = { ...m.scores };
        (s as any).match = m;
        (s as any).teams = m.teams;
        return [s];
    }
}
