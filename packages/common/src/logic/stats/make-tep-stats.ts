import { Season } from "../Season";
import { filterMapTreeList } from "../descriptors/descriptor";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { Color, NonRankStatColumn, StatSet, StatSetSection, StatType } from "./stat-table";

export const TepStatGroup = {
    Tot: "tot",
    Avg: "avg",
    Opr: "opr",
    Min: "min",
    Max: "max",
    Dev: "dev",
} as const;
export type TepStatGroup = (typeof TepStatGroup)[keyof typeof TepStatGroup];

export const TEP_STAT_GROUPS = [
    TepStatGroup.Tot,
    TepStatGroup.Avg,
    TepStatGroup.Opr,
    TepStatGroup.Min,
    TepStatGroup.Max,
    TepStatGroup.Dev,
];

export const TEP_GROUP_COLORS = {
    [TepStatGroup.Tot]: Color.Red,
    [TepStatGroup.Avg]: Color.Purple,
    [TepStatGroup.Opr]: Color.Purple,
    [TepStatGroup.Min]: Color.LightBlue,
    [TepStatGroup.Max]: Color.Blue,
    [TepStatGroup.Dev]: Color.Green,
};

export const TEP_GROUP_DATA_TYS = {
    [TepStatGroup.Tot]: StatType.Int,
    [TepStatGroup.Avg]: StatType.Float,
    [TepStatGroup.Opr]: StatType.Float,
    [TepStatGroup.Min]: StatType.Int,
    [TepStatGroup.Max]: StatType.Int,
    [TepStatGroup.Dev]: StatType.Float,
};

export const TEP_GROUP_NAMES = {
    [TepStatGroup.Tot]: ["Total", ""],
    [TepStatGroup.Avg]: ["Average", ""],
    [TepStatGroup.Opr]: ["", "Opr"],
    [TepStatGroup.Min]: ["Minimum", ""],
    [TepStatGroup.Max]: ["Maximum", ""],
    [TepStatGroup.Dev]: ["", "Standard Deviation"],
};

export const TEP_GROUP_DESC = {
    [TepStatGroup.Tot]: "The sum of all points scored in the category.",
    [TepStatGroup.Avg]: "The average number of points scored in the category.",
    [TepStatGroup.Opr]: "Offensive Power Rating.",
    [TepStatGroup.Min]: "The lowest number of points scored in the category.",
    [TepStatGroup.Max]: "The highest number of points scored in the category.",
    [TepStatGroup.Dev]: "The standard deviation of scores in the category.",
};

let statSetCache: Partial<Record<`${Season}-${boolean}`, StatSet<any>>> = {};

export function getTepStatSet(season: Season, remote: boolean): StatSet<any> {
    let key = `${season}-${remote}` as const;
    let descriptor = DESCRIPTORS[season];
    if (!(season in statSetCache)) {
        let soloStats = [
            new NonRankStatColumn({
                color: Color.White,
                id: "team",
                columnName: "Team",
                dialogName: "Team",
                titleName: "Team",
                sqlExpr: "teamNumber",
                ty: StatType.Team,
                getNonRankValue: (d: any) => ({
                    ty: "team",
                    name: d.team.name,
                    number: d.team.number,
                }),
            }),
            new NonRankStatColumn({
                color: Color.White,
                id: "eventRank",
                columnName: "Rank",
                dialogName: "Ranking",
                titleName: "Event Ranking",
                sqlExpr: "rank",
                ty: StatType.Rank,
                getNonRankValue: (d: any) => {
                    const stats = d.stats;
                    if (!stats || stats.rank == null) return null;
                    return { ty: "rank", val: stats.rank };
                },
            }),
            new NonRankStatColumn({
                color: Color.Red,
                id: "rankingScore",
                columnName: "RS",
                dialogName: "Ranking Score",
                titleName: "Ranking Score",
                sqlExpr: "rp",
                ty: StatType.Float,
                getNonRankValue: (d: any) => {
                    const stats = d.stats;
                    if (!stats || stats.rp == null) return null;
                    return {
                        ty: StatType.Float,
                        val: stats.rp,
                    };
                },
            }),
            new NonRankStatColumn({
                color: Color.LightBlue,
                id: "tb1",
                columnName: "TBP",
                dialogName: "Tie Breaker Points",
                titleName: "Tie Breaker Points",
                sqlExpr: "tb1",
                ty: StatType.Float,
                getNonRankValue: (d: any) => {
                    const stats = d.stats;
                    if (!stats || stats.tb1 == null) return null;
                    return { ty: "float", val: stats.tb1 };
                },
            }),
            ...(descriptor.rankings.tb == "LosingScore"
                ? []
                : [
                      new NonRankStatColumn({
                          color: Color.Blue,
                          id: "tb2",
                          columnName: "TBP2",
                          dialogName: "Tie Breaker Points 2",
                          titleName: "Tie Breaker Points 2",
                          sqlExpr: "tb2",
                          ty: StatType.Float,
                          getNonRankValue: (d: any) => {
                              const stats = d.stats;
                              if (!stats || stats.tb2 == null) return null;
                              return { ty: "float", val: stats.tb2 };
                          },
                      }),
                  ]),
            new NonRankStatColumn({
                color: Color.Green,
                id: "played",
                columnName: "Played",
                dialogName: "Matches Played",
                titleName: "Matches Played",
                sqlExpr: "qualMatchesPlayed",
                ty: StatType.Int,
                getNonRankValue: (d: any) => {
                    const val = d?.stats?.qualMatchesPlayed;
                    return val == null ? null : { ty: "int", val };
                },
            }),
            ...(remote
                ? []
                : [
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "wins",
                          columnName: "Wins",
                          dialogName: "Wins",
                          titleName: "Wins",
                          sqlExpr: "wins",
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => {
                              const stats = d.stats;
                              if (!stats || !("wins" in stats) || stats.wins == null) return null;
                              return { ty: "int", val: stats.wins };
                          },
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "losses",
                          columnName: "Losses",
                          dialogName: "Losses",
                          titleName: "Losses",
                          sqlExpr: "losses",
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => {
                              const stats = d.stats;
                              if (!stats || !("losses" in stats) || stats.losses == null)
                                  return null;
                              return { ty: "int", val: stats.losses };
                          },
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "ties",
                          columnName: "Ties",
                          dialogName: "Ties",
                          titleName: "Ties",
                          sqlExpr: "ties",
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => {
                              const stats = d.stats;
                              if (!stats || !("ties" in stats) || stats.ties == null) return null;
                              return { ty: "int", val: stats.ties };
                          },
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "eventRecord",
                          columnName: "Record",
                          dialogName: "Record",
                          titleName: "Record",
                          sqlExpr: "(wins * 2 + ties / NULLIF(qual_matches_played, 0))",
                          ty: StatType.Record,
                          getNonRankValue: (d: any) => {
                              const stats = d.stats;
                              if (!stats || !("wins" in stats)) return null;
                              if (stats.wins == null || stats.losses == null || stats.ties == null)
                                  return null;
                              return {
                                  ty: "record",
                                  wins: stats.wins,
                                  losses: stats.losses,
                                  ties: stats.ties,
                              };
                          },
                      }),
                  ]),
        ];

        let eventStats = [
            new NonRankStatColumn({
                id: "event",
                columnName: "Event",
                titleName: "Event",
                dialogName: "Event",
                sqlExpr: "start",
                color: Color.White,
                ty: StatType.Event,
                getNonRankValue: (d: any) =>
                    "event" in d
                        ? {
                              ty: "event",
                              season: d.event.season,
                              code: d.event.code,
                              name: d.event.name,
                              start: d.event.start,
                              end: d.event.end,
                          }
                        : null,
            }),
        ];

        let soloSection = new StatSetSection(
            "Team's Event Performance",
            soloStats.map((s) => ({ val: { id: s.id, name: s.dialogName }, children: [] })),
            [{ id: "", name: "", color: Color.Purple, description: null }]
        );

        let eventSection = new StatSetSection(
            "Event",
            [{ val: { id: "event", name: "Event" }, children: [] }],
            [{ id: "", name: "", color: Color.Purple, description: null }]
        );

        let groupStats = descriptor
            .tepColumns()
            .flatMap((t) => TEP_STAT_GROUPS.map((g) => t.getStatColumn(g)));

        let groupSection = new StatSetSection(
            "Match Scores",
            filterMapTreeList(descriptor.getTepTree(remote), (t) => ({
                id: t.id,
                name: t.dialogName,
            })),
            TEP_STAT_GROUPS.map((g) => ({
                id: g,
                name: g.toUpperCase(),
                color: TEP_GROUP_COLORS[g],
                description: TEP_GROUP_DESC[g],
            }))
        );

        statSetCache[key] = new StatSet(
            `tep${season}${remote ? "Remote" : "Trad"}`,
            [...soloStats, ...groupStats, ...eventStats],
            [soloSection, groupSection, eventSection]
        );
    }

    return statSetCache[key]!;
}
