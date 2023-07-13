import { Season } from "../Season";
import { type ColumnType } from "typeorm";

export type SeasonDescriptor = {
    season: Season;
    hasRemote: boolean;
};

export type MatchScoreTableDescriptor<TrScore, RemScore, CNames extends string> = {
    season: Season;
    columns: MatchScoreTableDescriptorColumn<TrScore, RemScore, CNames, ColumnType>[];
};

export type MatchScoreTableDescriptorColumn<
    TrScore,
    RemScore,
    CNames extends string,
    CT extends ColumnType
> = CT extends any
    ? {
          name: CNames;
          ty: CT;
          enum?: Object | any[];
          tradOnly?: boolean;
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

type TsTypeFromToType<T extends ColumnType> = T extends "int8" | "smallint"
    ? number
    : T extends "bool"
    ? boolean
    : T extends "enum" | "json"
    ? any
    : never;
