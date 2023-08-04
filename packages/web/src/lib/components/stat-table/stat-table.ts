export const StatType = {
    Int: "int",
    Float: "float",
    Team: "team",
    Rank: "rank",
    Record: "record",
} as const;
export type StatType = (typeof StatType)[keyof typeof StatType];
export type StatValue =
    | { ty: "int"; val: number }
    | { ty: "float"; val: number }
    | { ty: "rank"; val: number }
    | { ty: "team"; number: number; name: string }
    | { ty: "record"; wins: number; losses: number; ties: number };

export const Color = {
    White: "white",
    Purple: "purple",
    Green: "green",
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

export type StatData<T> = {
    noFilterRank: number;
    filterRank: number;
    noFilterSkipRank: number;
    filterSkipRank: number;
    data: T;
};
