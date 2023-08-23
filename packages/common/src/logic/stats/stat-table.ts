import { groupBySingle } from "../../utils/filter";
import { titleCase } from "../../utils/string";
import { Tree } from "../descriptors/descriptor";

export const SortDir = {
    Asc: "Asc",
    Desc: "Desc",
} as const;
export type SortDir = (typeof SortDir)[keyof typeof SortDir];

export const StatType = {
    Int: "int",
    Float: "float",
    Rank: "rank",
    Record: "record",
    Team: "team",
    Event: "event",
} as const;
export type StatType = (typeof StatType)[keyof typeof StatType];
export type StatValue =
    | { ty: "int"; val: number }
    | { ty: "float"; val: number }
    | { ty: "rank"; val: number }
    | { ty: "team"; number: number; name: string }
    | { ty: "event"; season: number; code: string; name: string; start: string; end: string }
    | { ty: "record"; wins: number; losses: number; ties: number };

export const Color = {
    White: "white",
    Red: "red",
    Blue: "blue",
    LightBlue: "light-blue",
    Green: "green",
    Purple: "purple",
} as const;
export type Color = (typeof Color)[keyof typeof Color];

export class StatColumn<T> {
    id: string;
    columnName: string;
    dialogName: string;
    titleName: string;

    color: Color;

    ty: StatType;
    getValue: (_: StatData<T>) => StatValue | null;
    getValueDistilled(d: StatData<T>) {
        return StatColumn.distill(this.getValue(d));
    }

    static distill(val: StatValue | null): number | string | null {
        if (val == null) return null;
        if (val.ty == "int" || val.ty == "float" || val.ty == "rank") {
            return val.val;
        } else if (val.ty == "team") {
            return val.number;
        } else if (val.ty == "event") {
            return val.start;
        } else {
            let num = val.wins + val.ties / 2;
            let denom = val.wins + val.losses + val.ties;
            return num / denom;
        }
    }

    constructor(opts: {
        id: string;
        columnName: string;
        dialogName: string;
        titleName: string;

        color: Color;

        ty: StatType;
        getValue: (_: StatData<T>) => StatValue | null;
    }) {
        this.id = opts.id;
        this.columnName = opts.columnName;
        this.dialogName = opts.dialogName;
        this.titleName = opts.titleName;
        this.color = opts.color;
        this.ty = opts.ty;
        this.getValue = opts.getValue;
    }

    shouldExpand(): boolean {
        return this.ty == StatType.Team;
    }
}

export class NonRankStatColumn<T> extends StatColumn<T> {
    getNonRankValue: (_: T) => StatValue | null;
    getNonRankValueDistilled(d: T) {
        return StatColumn.distill(this.getNonRankValue(d));
    }

    sqlExpr: string;

    constructor(opts: {
        id: string;
        columnName: string;
        dialogName: string;
        titleName: string;
        sqlExpr: string;

        color: Color;

        ty: StatType;
        getNonRankValue: (_: T) => StatValue | null;
    }) {
        super({ ...opts, getValue: (d) => opts.getNonRankValue(d.data) });
        this.getNonRankValue = opts.getNonRankValue;
        this.sqlExpr = opts.sqlExpr;
    }
}

export type StatData<T> = {
    noFilterRank: number;
    filterRank: number;
    noFilterSkipRank: number;
    filterSkipRank: number;
    data: T;
};

export const RankTy = {
    NoFilter: "NoFilter",
    Filter: "Filter",
    NoFilterSkip: "NoFilterSkip",
    FilterSkip: "FilterSkip",
} as const;
export type RankTy = (typeof RankTy)[keyof typeof RankTy];

export const RANK_STATS = {
    [RankTy.NoFilter]: new StatColumn<any>({
        id: "noFilterRank",
        columnName: "Rank",
        dialogName: "Rank",
        titleName: "No Filter Rank",
        color: Color.White,
        ty: StatType.Rank,
        getValue: (d) => ({ ty: StatType.Rank, val: d.noFilterRank }),
    }),
    [RankTy.Filter]: new StatColumn<any>({
        id: "filterRank",
        columnName: "Rank",
        dialogName: "Rank",
        titleName: "Filter Rank",
        color: Color.White,
        ty: StatType.Rank,
        getValue: (d) => ({ ty: StatType.Rank, val: d.filterRank }),
    }),
    [RankTy.NoFilterSkip]: new StatColumn<any>({
        id: "noFilterSkipRank",
        columnName: "Rank",
        dialogName: "Rank",
        titleName: "No Filter Skipping Rank",
        color: Color.White,
        ty: StatType.Rank,
        getValue: (d) => ({ ty: StatType.Rank, val: d.noFilterSkipRank }),
    }),
    [RankTy.FilterSkip]: new StatColumn<any>({
        id: "filterSkipRank",
        columnName: "Rank",
        dialogName: "Rank",
        titleName: "Filter Skipping Rank",
        color: Color.White,
        ty: StatType.Rank,
        getValue: (d) => ({ ty: StatType.Rank, val: d.filterSkipRank }),
    }),
};

export type StatSectionColumn = {
    id: string;
    name: string;
    color: Color;
    description: string | null;
};

export type StatSectionRow = {
    id: string;
    name: string;
};

export class StatSetSection {
    name: string;
    rows: Tree<StatSectionRow>[];
    columns: StatSectionColumn[];

    constructor(name: string, rows: Tree<StatSectionRow>[], columns: StatSectionColumn[]) {
        this.name = name;
        this.rows = rows;
        this.columns = columns;
    }

    getId(rowId: string, columnId: string) {
        return rowId + titleCase(columnId);
    }

    getRowId(row: string) {
        return row + this.columns.map((c) => c.id);
    }
}

export class StatSet<T> {
    id: string;
    allStats: NonRankStatColumn<T>[];
    sections: StatSetSection[];

    private allStatsRecord: Record<string, NonRankStatColumn<T>>;

    constructor(id: string, allStats: NonRankStatColumn<T>[], sections: StatSetSection[]) {
        this.id = id;
        this.allStats = allStats;
        this.sections = sections;
        this.allStatsRecord = groupBySingle(allStats, (s) => s.id);
    }

    getStat(id: string): NonRankStatColumn<T> {
        return this.allStatsRecord[id];
    }
}
