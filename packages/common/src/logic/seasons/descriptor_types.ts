import { GraphQLNamedType, GraphQLOutputType } from "graphql";
import { Season } from "../Season";
import { type ColumnType } from "typeorm";

// --- Season ---

export type SeasonDescriptor = {
    season: Season;
    hasRemote: boolean;
};

// --- Backend Match ---

export type MatchScoreTableDescriptor<TrScore, RemScore, CNames extends string> = {
    season: Season;
    hasRemote: boolean;
    gqlTys: GraphQLNamedType[];
    columns: MatchScoreTableDescriptorColumn<TrScore, RemScore, CNames, ColumnType>[];
};

export type MatchScoreTableDescriptorColumn<
    TrScore,
    RemScore,
    CNames extends string,
    CT extends ColumnType
> = CT extends any
    ? {
          dbName: CNames;
          enum?: Object | any[];
          apiTy?: GraphQLOutputType;
          tradOnly?: boolean;
          dbTy: CT;
      } & CreatorFunc<TrScore, RemScore, CNames, CT>
    : never;

type CreatorFunc<TrScore, RemScore, CNames extends string, CT extends ColumnType> =
    | {
          fromApi: (api: TrScore, other: TrScore) => TsTypeFromToType<CT>;
          fromRemoteApi?: (api: RemScore) => TsTypeFromToType<CT>;
      }
    | {
          fromSelf: (self: Record<CNames, any>) => TsTypeFromToType<CT>;
      };
export function inferMSTD<TrScore, RemScore, CNames extends string>(
    x: MatchScoreTableDescriptor<TrScore, RemScore, CNames>
): MatchScoreTableDescriptor<TrScore, RemScore, CNames> {
    return x;
}

type TsTypeFromToType<T extends ColumnType> = T extends "enum"
    ? string
    : T extends "int8" | "smallint"
    ? number
    : T extends "bool"
    ? boolean
    : T extends "enum" | "json"
    ? any
    : never;
