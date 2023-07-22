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

export class Descriptor {
    season: Season;
    hasRemote: boolean;
    pensSubtract: boolean;
    rankings: RankingsMethod;

    columns: DescriptorColumn[] = [];

    constructor(opts: DescriptorOpts) {
        this.season = opts.season;
        this.hasRemote = opts.hasRemote;
        this.pensSubtract = opts.pensSubtract;
        this.rankings = opts.rankings;
    }

    addColumn(col: DescriptorColumn): Descriptor {
        this.columns.push(col);
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

    addSelfFromApi(api: any, other: any, self: any) {
        self[this.dbColName] =
            "fromSelf" in this.create
                ? this.create.fromSelf(self)
                : this.create.fromApi(api, other);
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

export class DescriptorColumn {
    baseName: string;
    tradOnly: boolean;
    ms?: MatchScoreComponent;
    tep?: TepComponent;

    constructor(opts: { name: string; tradOnly?: boolean }) {
        this.baseName = opts.name;
        this.tradOnly = !!opts.tradOnly;
    }

    addMatchScore(opts: {
        dbColName?: string;
        apiName?: string;
        remoteApiName?: string;
        outer?: boolean;
        create: MsCreationMethod;
        dataTy: DescriptorDataType;
        apiMap?: (r: any, b: any) => any;
    }): DescriptorColumn {
        this.ms = new MatchScoreComponent({
            tradOnly: this.tradOnly,
            dbColName: opts.dbColName ?? this.baseName,
            apiName: opts.apiName ?? this.baseName,
            remoteApiName: opts.remoteApiName ?? opts.apiName ?? this.baseName,
            outer: !!opts.outer,
            create: opts.create,
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

    finish(): DescriptorColumn {
        return this;
    }
}
