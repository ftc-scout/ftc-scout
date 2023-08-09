import { DESCRIPTORS, Season, TepComponent } from "@ftc-scout/common";
import { Color, NonRankStatColumn, StatSet, StatSetSection, StatType } from "../stat-table";
import { titleCase } from "../../../util/string";

export const TepStatGroup = {
    Tot: "tot",
    Avg: "avg",
    Opr: "opr",
    Min: "min",
    Max: "max",
    Dev: "dev",
} as const;
export type TepStatGroup = (typeof TepStatGroup)[keyof typeof TepStatGroup];

const GROUP_COLORS = {
    [TepStatGroup.Tot]: Color.White,
    [TepStatGroup.Avg]: Color.White,
    [TepStatGroup.Opr]: Color.White,
    [TepStatGroup.Min]: Color.White,
    [TepStatGroup.Max]: Color.White,
    [TepStatGroup.Dev]: Color.White,
};

const GROUP_DATA_TYS = {
    [TepStatGroup.Tot]: StatType.Int,
    [TepStatGroup.Avg]: StatType.Float,
    [TepStatGroup.Opr]: StatType.Float,
    [TepStatGroup.Min]: StatType.Int,
    [TepStatGroup.Max]: StatType.Int,
    [TepStatGroup.Dev]: StatType.Float,
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
        dialogName: th.apiName, // TODO
        titleName: th.apiName, // TODO
        ty: GROUP_DATA_TYS[group],
        getNonRankValue: (d) => ({ ty: GROUP_DATA_TYS[group], val: d.stats[group][th.apiName] }),
    });
};

let statSetCache: Partial<Record<Season, StatSet<any>>> = {};

export function getTepStatSet(season: Season): StatSet<any> {
    if (!(season in statSetCache)) {
        let groupStats = DESCRIPTORS[season]
            .tepColumns()
            .flatMap((t) => [
                t.getStatColumn(TepStatGroup.Tot),
                t.getStatColumn(TepStatGroup.Avg),
                t.getStatColumn(TepStatGroup.Min),
                t.getStatColumn(TepStatGroup.Max),
                t.getStatColumn(TepStatGroup.Dev),
                t.getStatColumn(TepStatGroup.Opr),
            ]);

        statSetCache[season] = new StatSet(groupStats, [
            new StatSetSection(
                "Match Scores",
                DESCRIPTORS[season].tepColumns().map((c) => ({ id: c.id, name: c.apiName })),
                [
                    {
                        id: TepStatGroup.Tot,
                        name: "TOT",
                        color: Color.Purple,
                        description: "The sum of all points scored in the category.",
                    },
                    {
                        id: TepStatGroup.Avg,
                        name: "AVG",
                        color: Color.Purple,
                        description: "The average number of points scored in the category.",
                    },
                    {
                        id: TepStatGroup.Opr,
                        name: "OPR",
                        color: Color.Purple,
                        description: "Offensive Power Rating.",
                    },
                    {
                        id: TepStatGroup.Min,
                        name: "MIN",
                        color: Color.Purple,
                        description: "The lowest number of points scored in the category.",
                    },
                    {
                        id: TepStatGroup.Max,
                        name: "MAX",
                        color: Color.Purple,
                        description: "The highest number of points scored in the category.",
                    },
                    {
                        id: TepStatGroup.Dev,
                        name: "DEV",
                        color: Color.Green,
                        description: "The standard deviation of scores in the category.",
                    },
                ]
            ),
        ]);
    }

    return statSetCache[season]!;
}
