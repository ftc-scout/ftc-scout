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
    [TepStatGroup.Tot]: Color.Purple,
    [TepStatGroup.Avg]: Color.Purple,
    [TepStatGroup.Opr]: Color.Purple,
    [TepStatGroup.Min]: Color.Purple,
    [TepStatGroup.Max]: Color.Purple,
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
                color: Color.Green,
                id: "record",
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
        ];

        let soloSection = new StatSetSection(
            "Team's Event Performance",
            [
                { val: { id: "team", name: "Team" }, children: [] },
                { val: { id: "record", name: "Record" }, children: [] },
            ],
            [{ id: "", name: "", color: Color.Purple, description: null }]
        );

        let groupStats = DESCRIPTORS[season]
            .tepColumns()
            .flatMap((t) => TEP_STAT_GROUPS.map((g) => t.getStatColumn(g)));

        let groupSection = new StatSetSection(
            "Match Scores",
            filterMapTreeList(DESCRIPTORS[season].getTepTree(remote), (t) => ({
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

        statSetCache[key] = new StatSet([...soloStats, ...groupStats], [soloSection, groupSection]);
    }

    return statSetCache[key]!;
}
