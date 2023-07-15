import { GraphQLOutputType } from "graphql";
import { Season } from "../Season";
import { type ColumnType } from "typeorm";
import { Descriptor2019 } from "./seasons/SkystoneDescriptor";
import { Descriptor2020 } from "./seasons/UltimateGoalDescriptor";
import { Descriptor2021 } from "./seasons/FreightFrenzyDescriptor";
import { Descriptor2022 } from "./seasons/PowerPlayDescriptor";

// HELP: Season Specific

export const DESCRIPTORS: Record<Season, Descriptor> = {
    [Season.Skystone]: Descriptor2019,
    [Season.UltimateGoal]: Descriptor2020,
    [Season.FreightFrenzy]: Descriptor2021,
    [Season.PowerPlay]: Descriptor2022,
};
export const DESCRIPTORS_LIST = Object.values(DESCRIPTORS);

export type AnyObject = { [key: string]: any };

export type DescriptorType = {
    typeorm: {
        type: ColumnType;
        enum?: Object | any[];
    };
    gql: GraphQLOutputType;
};

export type Descriptor = GenDescriptor<AnyObject, AnyObject, string>;
export function inferDescriptor<
    TradApi extends AnyObject,
    RemoteApi extends AnyObject,
    Names extends string
>(d: GenDescriptor<TradApi, RemoteApi, Names>): Descriptor {
    return d;
}
export type GenDescriptor<TradApi, RemoteApi, Names extends string> = {
    season: Season;
    hasRemote: boolean;
    columns: {
        name: Names;
        type: DescriptorType;
        msDB?: MsDbDescriptor<TradApi, RemoteApi, Names>;
        msApi?: MsApiDescriptor<Names>;
    }[];
};

type MsDbDescriptor<TradApi, RemoteApi, Names extends string> = {
    name?: string;
    tradOnly?: boolean;
} & (
    | {
          fromTradApi(ours: TradApi, opp: TradApi): any;
          fromRemoteApi?(ours: RemoteApi): any;
      }
    | {
          fromSelf(self: Record<Names, any>): any;
      }
);

type MsApiDescriptor<Names extends string> = {
    outer?: boolean;
    map?(red: Record<Names, any>, blue: Record<Names, any>): any;
};
