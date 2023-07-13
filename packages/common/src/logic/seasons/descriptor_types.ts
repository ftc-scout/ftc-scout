import { Season } from "../Season";
import { type ColumnType } from "typeorm";

export type SeasonDescriptor = {
    season: Season;
    hasRemote: boolean;
};

export type MatchScoreTableDescriptor<TrScore, RemScore> = {
    season: Season;
    columns: MatchScoreTableDescriptorColumn<TrScore, RemScore, ColumnType>[];
};
export type MatchScoreTableDescriptorColumn<TrScore, RemScore, T extends ColumnType> = T extends any
    ? {
          name: string;
          ty: T;
          tradOnly?: boolean;
          fromApi: (api: TrScore) => TsTypeFromToType<T>;
          fromRemoteApi?: (api: RemScore) => TsTypeFromToType<T>;
      }
    : never;
export function inferMSTD<TrScore, RemScore>(
    x: MatchScoreTableDescriptor<TrScore, RemScore>
): MatchScoreTableDescriptor<TrScore, RemScore> {
    return x;
}

type TsTypeFromToType<T extends ColumnType> = T extends "int8" | "int16" ? number : never;
