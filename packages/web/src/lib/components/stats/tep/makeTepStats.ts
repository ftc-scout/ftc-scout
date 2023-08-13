import { DESCRIPTORS, Season, TepComponent, filterMapTreeList } from "@ftc-scout/common";
import { Color, NonRankStatColumn, StatSet, StatSetSection, StatType } from "../stat-table";
import { titleCase } from "../../../util/string";
import type { EventPageQuery } from "../../../graphql/generated/graphql-operations";

export const TepStatGroup = {
    Tot: "tot",
    Avg: "avg",
    Opr: "opr",
    Min: "min",
    Max: "max",
    Dev: "dev",
} as const;
export type TepStatGroup = (typeof TepStatGroup)[keyof typeof TepStatGroup];

const TEP_STAT_GROUPS = [
    TepStatGroup.Tot,
    TepStatGroup.Avg,
    TepStatGroup.Opr,
    TepStatGroup.Min,
    TepStatGroup.Max,
    TepStatGroup.Dev,
];

const GROUP_COLORS = {
    [TepStatGroup.Tot]: Color.Red,
    [TepStatGroup.Avg]: Color.Purple,
    [TepStatGroup.Opr]: Color.Purple,
    [TepStatGroup.Min]: Color.LightBlue,
    [TepStatGroup.Max]: Color.Blue,
    [TepStatGroup.Dev]: Color.Green,
};

const GROUP_DATA_TYS = {
    [TepStatGroup.Tot]: StatType.Int,
    [TepStatGroup.Avg]: StatType.Float,
    [TepStatGroup.Opr]: StatType.Float,
    [TepStatGroup.Min]: StatType.Int,
    [TepStatGroup.Max]: StatType.Int,
    [TepStatGroup.Dev]: StatType.Float,
};

const GROUP_DESC = {
    [TepStatGroup.Tot]: "The sum of all points scored in the category.",
    [TepStatGroup.Avg]: "The average number of points scored in the category.",
    [TepStatGroup.Opr]: "Offensive Power Rating.",
    [TepStatGroup.Min]: "The lowest number of points scored in the category.",
    [TepStatGroup.Max]: "The highest number of points scored in the category.",
    [TepStatGroup.Dev]: "The standard deviation of scores in the category.",
};

declare module "@ftc-scout/common" {
    interface TepComponent {
        getStatColumn(group: TepStatGroup): NonRankStatColumn<any>;
    }
}

TepComponent.prototype.getStatColumn = function (group: TepStatGroup) {
    let th = this! as TepComponent;

    return new NonRankStatColumn({
        color: GROUP_COLORS[group],
        id: th.id + titleCase(group),
        columnName: (th.columnPrefix + " " + group.toUpperCase()).trim(),
        dialogName: th.dialogName,
        titleName: th.apiName, // TODO
        ty: GROUP_DATA_TYS[group],
        getNonRankValue: (d) => ({ ty: GROUP_DATA_TYS[group], val: d.stats[group][th.apiName] }),
    });
};

let statSetCache: Partial<Record<`${Season}-${boolean}`, StatSet<any>>> = {};

export function getTepStatSet(season: Season, remote: boolean): StatSet<any> {
    type T = NonNullable<EventPageQuery["eventByCode"]>["teams"][number];

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
                ty: StatType.Team,
                getNonRankValue: (d: T) => ({
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
                ty: StatType.Rank,
                getNonRankValue: (d: any) => ({ ty: "rank", val: d.stats.rank }),
            }),
            new NonRankStatColumn({
                color: Color.Red,
                id: "rankingPoints",
                columnName: "RP",
                dialogName: "Ranking Points",
                titleName: "Ranking Points",
                ty: descriptor.rankings.rp == "Record" ? StatType.Float : StatType.Int,
                getNonRankValue: (d: any) => ({
                    ty: descriptor.rankings.rp == "Record" ? StatType.Float : StatType.Int,
                    val: d.stats.rp,
                }),
            }),
            new NonRankStatColumn({
                color: Color.LightBlue,
                id: "tb1",
                columnName: "TBP",
                dialogName: "Tie Breaker Points",
                titleName: "Tie Breaker Points",
                ty: StatType.Float,
                getNonRankValue: (d: any) => ({ ty: "float", val: d.stats.tb1 }),
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
                          ty: StatType.Float,
                          getNonRankValue: (d: any) => ({ ty: "float", val: d.stats.tb2 }),
                      }),
                  ]),
            new NonRankStatColumn({
                color: Color.Green,
                id: "played",
                columnName: "Played",
                dialogName: "Matches Played",
                titleName: "Matches Played",
                ty: StatType.Int,
                getNonRankValue: (d: any) => ({ ty: "int", val: d.stats.qualMatchesPlayed }),
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
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => ({ ty: "int", val: d.stats.wins }),
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "losses",
                          columnName: "Losses",
                          dialogName: "Losses",
                          titleName: "Losses",
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => ({ ty: "int", val: d.stats.losses }),
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "ties",
                          columnName: "Ties",
                          dialogName: "Ties",
                          titleName: "Ties",
                          ty: StatType.Int,
                          getNonRankValue: (d: any) => ({ ty: "int", val: d.stats.ties }),
                      }),
                      new NonRankStatColumn({
                          color: Color.Green,
                          id: "eventRecord",
                          columnName: "Record",
                          dialogName: "Record",
                          titleName: "Record",
                          ty: StatType.Record,
                          getNonRankValue: (d: any) => ({
                              ty: "record",
                              wins: d.stats.wins,
                              losses: d.stats.losses,
                              ties: d.stats.ties,
                          }),
                      }),
                  ]),
        ];

        let soloSection = new StatSetSection(
            "Team's Event Performance",
            soloStats.map((s) => ({ val: { id: s.id, name: s.dialogName }, children: [] })),
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
                color: GROUP_COLORS[g],
                description: GROUP_DESC[g],
            }))
        );

        statSetCache[key] = new StatSet(
            `tep${season}${remote ? "Remote" : "Trad"}`,
            [...soloStats, ...groupStats],
            [soloSection, groupSection]
        );
    }

    return statSetCache[key]!;
}
