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
        ty: StatType.Float,
        getNonRankValue: (d) => ({ ty: StatType.Float, val: d.stats[group][th.apiName] }),
    });
};

let statSetCache: Partial<Record<Season, StatSet<any>>> = {};

export function getTepStatSet(season: Season): StatSet<any> {
    if (!(season in statSetCache)) {
        let groupStats = DESCRIPTORS[season]
            .tepColumns()
            .map((t) => t.getStatColumn(TepStatGroup.Avg));

        statSetCache[season] = new StatSet(groupStats, [
            new StatSetSection(
                DESCRIPTORS[season].tepColumns().map((c) => c.id),
                ["avg"]
            ),
        ]);
    }

    return statSetCache[season]!;
}
