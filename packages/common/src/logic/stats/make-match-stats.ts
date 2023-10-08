import { Season } from "../Season";
import { Station } from "../Station";
import { MSStatSide, filterMapTreeList } from "../descriptors/descriptor";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { Color, NonRankStatColumn, StatSet, StatSetSection, StatType } from "./stat-table";

let statSetCache: Partial<Record<`${Season}-${boolean}`, StatSet<any>>> = {};

const TEAM_STATS = [
    new NonRankStatColumn({
        color: Color.White,
        id: "team1This",
        columnName: "Team 1",
        dialogName: "Team 1",
        titleName: "Team 1",
        sqlExpr: "tmp1.team_number",
        ty: StatType.Team,
        getNonRankValue: (d: any) => {
            let t = d.teams.find((s: any) => s.station == Station.One || s.station == Station.Solo);
            return t ? { ty: "team", name: t.team.name, number: t.team.number } : null;
        },
    }),
    new NonRankStatColumn({
        color: Color.White,
        id: "team2This",
        columnName: "Team 2",
        dialogName: "Team 2",
        titleName: "Team 2",
        sqlExpr: "tmp2.team_number",
        ty: StatType.Team,
        getNonRankValue: (d: any) => {
            let t = d.teams.find((t: any) => t.station == Station.Two);
            return t ? { ty: "team", name: t.team.name, number: t.team.number } : null;
        },
    }),
    new NonRankStatColumn({
        color: Color.White,
        id: "team1Opp",
        columnName: "Opp Team 1",
        dialogName: "Team 1",
        titleName: "Opponent Team 1",
        sqlExpr: "tmp1Opp.team_number",
        ty: StatType.Team,
        getNonRankValue: (d: any) => {
            let opp = d.opponentsScore;
            if (!opp) return null;
            let t = opp.teams.find(
                (t: any) => t.station == Station.One || t.station == Station.Solo
            );
            return t ? { ty: "team", name: t.team.name, number: t.team.number } : null;
        },
    }),
    new NonRankStatColumn({
        color: Color.White,
        id: "team2Opp",
        columnName: "Opp Team 2",
        dialogName: "Team 2",
        titleName: "Opponent Team 2",
        sqlExpr: "tmp2Opp.team_number",
        ty: StatType.Team,
        getNonRankValue: (d: any) => {
            let opp = d.opponentsScore;
            if (!opp) return null;
            let t = opp.teams.find((t: any) => t.station == Station.Two);
            return t ? { ty: "team", name: t.team.name, number: t.team.number } : null;
        },
    }),
];

let INFO_STATS = [
    new NonRankStatColumn({
        color: Color.Purple,
        id: "matchNum",
        columnName: "Match Num",
        dialogName: "Match Number",
        titleName: "Match Number",
        sqlExpr: "match_id",
        ty: StatType.String,
        getNonRankValue: (d: any) => ({ ty: "string", val: d.match.description }),
    }),
    new NonRankStatColumn({
        color: Color.Purple,
        id: "alliance",
        columnName: "Alliance",
        dialogName: "Alliance",
        titleName: "Alliance",
        sqlExpr: "alliance",
        ty: StatType.String,
        getNonRankValue: (d: any) => (d.alliance ? { ty: "string", val: d.alliance } : null),
    }),
    new NonRankStatColumn({
        color: Color.Purple,
        id: "event",
        columnName: "Event",
        dialogName: "Event",
        titleName: "Event",
        sqlExpr: "e.start",
        ty: StatType.Event,
        getNonRankValue: (d: any) => {
            let e = d.match.event;
            return e
                ? {
                      ty: "event",
                      season: e.season,
                      code: e.code,
                      name: e.name,
                      start: e.start,
                      end: e.end,
                  }
                : null;
        },
    }),
];

const TOTAL_POINTS_STATS = [
    new NonRankStatColumn({
        color: Color.Blue,
        id: "totalPointsThis",
        columnName: "Total",
        dialogName: "Total Points",
        titleName: "Total Points",
        sqlExpr: `ms.totalPoints`,
        ty: StatType.Int,
        getNonRankValue: (d: any) => ({ ty: "int", val: d.totalPoints }),
    }),
    new NonRankStatColumn({
        color: Color.Blue,
        id: "totalPointsNpThis",
        columnName: "Total NP",
        dialogName: "Total Points NP",
        titleName: "Total Points No Penalties",
        sqlExpr: `ms.totalPointsNp`,
        ty: StatType.Int,
        getNonRankValue: (d: any) => ({ ty: "int", val: d.totalPointsNp }),
    }),
    new NonRankStatColumn({
        color: Color.Red,
        id: "totalPointsOpp",
        columnName: "Opp Total",
        dialogName: "Total Points",
        titleName: "Opponent Total Points",
        sqlExpr: `msOpp.totalPoints`,
        ty: StatType.Int,
        getNonRankValue: (d: any) =>
            d.opponentsScore ? { ty: "int", val: d.opponentsScore.totalPoints } : null,
    }),
    new NonRankStatColumn({
        color: Color.Red,
        id: "totalPointsNpOpp",
        columnName: "Opp Total NP",
        dialogName: "Total Points NP",
        titleName: "Opp Total Points No Penalties",
        sqlExpr: `msOpp.totalPointsNp`,
        ty: StatType.Int,
        getNonRankValue: (d: any) =>
            d.opponentsScore ? { ty: "int", val: d.opponentsScore.totalPointsNp } : null,
    }),
];

export function getMatchStatSet(season: Season, remote: boolean): StatSet<any> {
    let key = `${season}-${remote}` as const;
    let descriptor = DESCRIPTORS[season];

    if (!(season in statSetCache)) {
        let scoreStats = descriptor
            .scoreModalColumns()
            .flatMap((c) => [c.getStatColumn(MSStatSide.This), c.getStatColumn(MSStatSide.Opp)]);

        let scoreSection = new StatSetSection(
            "Scores",
            [
                { val: { id: "totalPoints", name: "Total Points" }, children: [] },
                { val: { id: "totalPointsNp", name: "Total Points NP" }, children: [] },
                ...filterMapTreeList(descriptor.getSCoreModalTree(remote), (t) => ({
                    id: t.id,
                    name: t.displayName,
                })),
            ],
            [
                {
                    id: MSStatSide.This,
                    name: "THIS",
                    color: Color.Blue,
                    description: "Points scored by this alliance.",
                },
                {
                    id: MSStatSide.Opp,
                    name: "OPP",
                    color: Color.Red,
                    description: "Points scored by the opposing alliance.",
                },
            ]
        );

        let teamsSection = new StatSetSection(
            "Teams",
            [
                { val: { id: "team1", name: "Team 1" }, children: [] },
                { val: { id: "team2", name: "Team 2" }, children: [] },
            ],
            [
                {
                    id: MSStatSide.This,
                    name: "THIS",
                    color: Color.Blue,
                    description: "Teams on this alliance.",
                },
                {
                    id: MSStatSide.Opp,
                    name: "OPP",
                    color: Color.Red,
                    description: "Teams on the opposing alliance.",
                },
            ]
        );

        let infoSection = new StatSetSection(
            "Info",
            INFO_STATS.map((s) => ({ val: { id: s.id, name: s.dialogName }, children: [] })),
            [{ id: "", name: "", color: Color.Purple, description: null }]
        );

        statSetCache[key] = new StatSet(
            `ms${season}${remote ? "Remote" : "Trad"}`,
            [...scoreStats, ...TOTAL_POINTS_STATS, ...TEAM_STATS, ...INFO_STATS],
            [scoreSection, teamsSection, infoSection]
        );
    }

    return statSetCache[key]!;
}
