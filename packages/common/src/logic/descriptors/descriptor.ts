import { type ColumnType } from "typeorm";
import { GraphQLOutputType } from "graphql";
import { Season } from "../Season";
import { notEmpty } from "../../utils/filter";
import { Station } from "../Station";

type RankingsMethod = {
    rp: "TotalPoints" | "Record";
    tb: "AutoEndgameTot" | "AutoEndgameAvg" | "LosingScore";
};

type DescriptorOpts = {
    season: Season;
    hasRemote: boolean;
    pensSubtract: boolean;
    rankings: RankingsMethod;
};

export type Tree<T> = {
    val: T;
    children: Tree<T>[];
};

function mapTree<T, U>(t: Tree<T>, mapper: (_: T) => U): Tree<U> {
    return {
        val: mapper(t.val),
        children: t.children.map((e) => mapTree(e, mapper)),
    };
}

export class Descriptor {
    season: Season;
    hasRemote: boolean;
    pensSubtract: boolean;
    rankings: RankingsMethod;

    columns: DescriptorColumn[] = [];
    columnsMap: Record<string, DescriptorColumn> = {};

    scoreModalTree: Tree<ScoreModalComponent>[] = [];

    constructor(opts: DescriptorOpts) {
        this.season = opts.season;
        this.hasRemote = opts.hasRemote;
        this.pensSubtract = opts.pensSubtract;
        this.rankings = opts.rankings;
    }

    addColumn(col: DescriptorColumn): Descriptor {
        this.columns.push(col);
        this.columnsMap[col.id] = col;
        return this;
    }

    addScoreModalTree(t: Tree<string>[]): Descriptor {
        this.scoreModalTree = t.map((e) => mapTree(e, (id) => this.columnsMap[id].scoreM!));
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
    dbName: string;
    apiName: string;
    tradOnly: boolean;
    isIndividual: boolean;
    make: (ms: Record<string, string>, station: Station) => number;

    constructor(opts: {
        dbName: string;
        apiName: string;
        tradOnly: boolean;
        isIndividual: boolean;
        make: (ms: Record<string, any>, station: Station) => number;
    }) {
        this.dbName = opts.dbName;
        this.apiName = opts.apiName;
        this.tradOnly = opts.tradOnly;
        this.isIndividual = opts.isIndividual;
        this.make = opts.make;
    }
}

export class ScoreModalComponent {
    displayName: string;
    getValue: (ms: any) => number;
    getValueRemote: ((ms: any) => number) | null;
    getTitle: (ms: any) => string;

    children: string[];

    constructor(opts: {
        displayName: string;
        getValue: (ms: any) => number;
        getValueRemote: ((ms: any) => number) | null;
        getTitle: (ms: any) => string;
        children: string[];
    }) {
        this.displayName = opts.displayName;
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

    addTep(
        opts: {
            dbName?: string;
            apiName?: string;
            isIndividual?: boolean;
            make?: (ms: Record<string, any>, station: Station) => number;
        } = {}
    ): DescriptorColumn {
        let msName = this.ms?.tradApiName ?? this.baseName;
        this.tep = new TepComponent({
            dbName: opts.dbName ?? this.baseName,
            apiName: opts.apiName ?? this.baseName,
            tradOnly: !!this.tradOnly,
            isIndividual: !!opts.isIndividual,
            make: opts.make ?? ((ms) => ms[msName]),
        });
        return this;
    }

    addScoreModal(opts: {
        displayName: string;
        getValue?: (ms: any) => number;
        getValueRemote?: (ms: any) => number;
        getTitle?: (ms: any) => string;
        children?: string[];
    }): DescriptorColumn {
        let tradMsName = this.ms?.getApiName(false) ?? this.baseName;
        let remoteMsName = this.ms?.getApiName(true) ?? this.baseName;
        this.scoreM = new ScoreModalComponent({
            displayName: opts.displayName,
            getValue: opts.getValue ?? ((ms) => ms[tradMsName]),
            getValueRemote: opts.getValueRemote ?? ((ms) => ms[remoteMsName]) ?? null,
            getTitle: opts.getTitle ?? (() => ""),
            children: opts.children ?? [],
        });
        return this;
    }

    finish(): DescriptorColumn {
        return this;
    }
}
