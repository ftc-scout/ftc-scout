import { type ColumnType } from "typeorm";
import { GraphQLOutputType } from "graphql";
import { Season } from "../Season";
import { notEmpty } from "../../utils/filter";
import { Station } from "../Station";

type RankingsMethod = {
    rp: "TotalPoints" | "Record";
    tb: "AutoEndgameTot" | "AutoEndgameAvg" | "LosingScore";
};

export type Tree<T> = {
    val: T;
    children: Tree<T>[];
};

export function filterMapTree<T, U>(
    t: Tree<T>,
    mapper: (_: T) => U | undefined
): Tree<U> | undefined {
    let val = mapper(t.val);
    return val
        ? {
              val,
              children: t.children.map((e) => filterMapTree(e, mapper)).filter(notEmpty),
          }
        : undefined;
}

export function filterMapTreeList<T, U>(ts: Tree<T>[], mapper: (_: T) => U | undefined): Tree<U>[] {
    return ts.map((t) => filterMapTree(t, mapper)).filter(notEmpty);
}

export class Descriptor {
    season: Season;
    seasonName: string;
    seasonNameWithYear: string;
    hasRemote: boolean;
    pensSubtract: boolean;
    rankings: RankingsMethod;

    columns: DescriptorColumn[] = [];
    columnsMap: Record<string, DescriptorColumn> = {};

    scoreModalTree: Tree<ScoreModalComponent>[] = [];
    scoreModalTreeRemote: Tree<ScoreModalComponent>[] = [];

    tepTree: Tree<TepComponent>[] = [];
    tepTreeRemote: Tree<TepComponent>[] = [];

    constructor(opts: {
        season: Season;
        seasonName: string;
        hasRemote: boolean;
        pensSubtract: boolean;
        rankings: RankingsMethod;
    }) {
        this.season = opts.season;
        this.seasonName = opts.seasonName;
        this.seasonNameWithYear = `${this.season} ${this.seasonName}`;
        this.hasRemote = opts.hasRemote;
        this.pensSubtract = opts.pensSubtract;
        this.rankings = opts.rankings;
    }

    addColumn(col: DescriptorColumn): Descriptor {
        this.columns.push(col);
        this.columnsMap[col.id] = col;
        return this;
    }

    addTree(trad: Tree<string>[], remote: Tree<string>[] = []): Descriptor {
        this.scoreModalTree = filterMapTreeList(trad, (id) => this.columnsMap[id]?.scoreM);
        this.scoreModalTreeRemote = filterMapTreeList(remote, (id) => this.columnsMap[id]?.scoreM);

        this.tepTree = filterMapTreeList(trad, (id) => this.columnsMap[id]?.tep);
        this.tepTreeRemote = filterMapTreeList(remote, (id) => this.columnsMap[id]?.tep);

        return this;
    }

    finish(): Descriptor {
        return this;
    }

    msColumns(): MatchScoreComponent[] {
        return this.columns.map((c) => c.ms).filter(notEmpty);
    }

    tepColumns(): TepComponent[] {
        return this.columns.map((c) => c.tep).filter(notEmpty);
    }

    typeSuffix(remote: boolean): "Trad" | "Remote" | "" {
        return remote ? "Remote" : this.hasRemote ? "Trad" : "";
    }

    getTepTree(remote: boolean): Tree<TepComponent>[] {
        return remote ? this.tepTreeRemote : this.tepTree;
    }
}

type MsCreationMethod =
    | {
          fromApi: (api: any, oth: any) => any;
      }
    | {
          fromSelf: (self: Record<string, any>) => any;
      };

export type DescriptorDataType = {
    typeorm: {
        type: ColumnType;
        enum?: Object | any[];
        enumName?: string;
    };
    gql: GraphQLOutputType;
};

export class MatchScoreComponent {
    tradOnly: boolean;
    dbColName: string;
    tradApiName: string;
    remoteApiName: string | null;
    outer: boolean;
    create: MsCreationMethod;
    dataTy: DescriptorDataType;
    apiMap: ((r: any, b: any) => any) | null;

    constructor(opts: {
        tradOnly: boolean;
        dbColName: string;
        apiName: string;
        remoteApiName: string | null;
        outer: boolean;
        create: MsCreationMethod;
        dataTy: DescriptorDataType;
        apiMap: ((r: any, b: any) => any) | null;
    }) {
        this.tradOnly = opts.tradOnly;
        this.dbColName = opts.dbColName;
        this.tradApiName = opts.apiName;
        this.remoteApiName = opts.remoteApiName;
        this.outer = opts.outer;
        this.create = opts.create;
        this.dataTy = opts.dataTy;
        this.apiMap = opts.apiMap;
    }

    addSelfFromApi(api: any, other: any, dbSelf: any, apiSelf: any, remote: boolean) {
        let val =
            "fromSelf" in this.create
                ? this.create.fromSelf(apiSelf)
                : this.create.fromApi(api, other);

        dbSelf[this.dbColName] = val;
        apiSelf[this.getApiName(remote)] = val;
    }

    getApiName(remote: boolean): string {
        return remote ? this.remoteApiName ?? this.tradApiName : this.tradApiName;
    }
}

export class TepComponent {
    tradOnly: boolean;
    isIndividual: boolean;
    id: string;

    dbName: string;
    apiName: string;
    columnPrefix: string;
    dialogName: string;

    make: (ms: Record<string, string>, station: Station) => number;

    constructor(opts: {
        tradOnly: boolean;
        isIndividual: boolean;
        id: string;

        dbName: string;
        apiName: string;
        columnPrefix: string;
        dialogName: string;

        make: (ms: Record<string, any>, station: Station) => number;
    }) {
        this.tradOnly = opts.tradOnly;
        this.isIndividual = opts.isIndividual;
        this.id = opts.id;

        this.dbName = opts.dbName;
        this.apiName = opts.apiName;
        this.columnPrefix = opts.columnPrefix;
        this.dialogName = opts.dialogName;

        this.make = opts.make;
    }
}

export class ScoreModalComponent {
    displayName: string;
    remoteDisplayName: string;
    getValue: (ms: any) => number;
    getValueRemote: ((ms: any) => number) | null;
    getTitle: (ms: any) => string;

    children: string[];

    constructor(opts: {
        displayName: string;
        remoteDisplayName: string;
        getValue: (ms: any) => number;
        getValueRemote: ((ms: any) => number) | null;
        getTitle: (ms: any) => string;
        children: string[];
    }) {
        this.displayName = opts.displayName;
        this.remoteDisplayName = opts.remoteDisplayName;
        this.getValue = opts.getValue;
        this.getValueRemote = opts.getValueRemote;
        this.getTitle = opts.getTitle;
        this.children = opts.children;
    }
}

export class DescriptorColumn {
    id: string;
    baseName: string;
    tradOnly: boolean;
    ms?: MatchScoreComponent;
    tep?: TepComponent;
    scoreM?: ScoreModalComponent;

    constructor(opts: { name: string; tradOnly?: boolean; id?: string }) {
        this.id = opts.id ?? opts.name;
        this.baseName = opts.name;
        this.tradOnly = !!opts.tradOnly;
    }

    addMatchScore(
        opts: {
            dbColName?: string;
            apiName?: string;
            remoteApiName?: string;
            outer?: boolean;
            dataTy: DescriptorDataType;
            apiMap?: (r: any, b: any) => any;
        } & MsCreationMethod
    ): DescriptorColumn {
        this.ms = new MatchScoreComponent({
            tradOnly: this.tradOnly,
            dbColName: opts.dbColName ?? this.baseName,
            apiName: opts.apiName ?? this.baseName,
            remoteApiName: opts.remoteApiName ?? opts.apiName ?? this.baseName,
            outer: !!opts.outer,
            create: opts,
            dataTy: opts.dataTy,
            apiMap: opts.apiMap ?? null,
        });
        return this;
    }

    addTep(opts: {
        isIndividual?: boolean;

        dbName?: string;
        apiName?: string;
        columnPrefix: string;
        dialogName?: string;

        make?: (ms: Record<string, any>, station: Station) => number;
    }): DescriptorColumn {
        let msName = this.ms?.tradApiName ?? this.baseName;
        this.tep = new TepComponent({
            tradOnly: !!this.tradOnly,
            isIndividual: !!opts.isIndividual,
            id: this.id,

            dbName: opts.dbName ?? this.baseName,
            apiName: opts.apiName ?? this.baseName,
            columnPrefix: opts.columnPrefix,
            dialogName: opts.dialogName ?? this.scoreM?.displayName ?? "<ERROR>",

            make: opts.make ?? ((ms) => ms[msName]),
        });
        return this;
    }

    addScoreModal(opts: {
        displayName: string;
        remoteDisplayName?: string;
        getValue?: (ms: any) => number;
        getValueRemote?: (ms: any) => number;
        getTitle?: (ms: any) => string;
        children?: string[];
    }): DescriptorColumn {
        let tradMsName = this.ms?.getApiName(false) ?? this.baseName;
        let remoteMsName = this.ms?.getApiName(true) ?? this.baseName;
        this.scoreM = new ScoreModalComponent({
            displayName: opts.displayName,
            remoteDisplayName: opts.remoteDisplayName ?? opts.displayName,
            getValue: opts.getValue ?? ((ms) => ms[tradMsName]),
            getValueRemote: opts.getValueRemote ?? opts.getValue ?? ((ms) => ms[remoteMsName]),
            getTitle: opts.getTitle ?? (() => ""),
            children: opts.children ?? [],
        });
        return this;
    }

    finish(): DescriptorColumn {
        return this;
    }
}
