import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLNullableType,
    GraphQLString,
    GraphQLType,
} from "graphql";
import { GraphQLDateTime, GraphQLDate } from "graphql-scalars";

type Wr<T> = { type: T };
export function wr<T>(t: T): Wr<T> {
    return { type: t };
}
export function nn<T extends GraphQLNullableType>(ty: T): GraphQLNonNull<T> {
    return new GraphQLNonNull(ty) as GraphQLNonNull<T>;
}
export function list<T extends GraphQLType>(ty: T): GraphQLNonNull<GraphQLList<T>> {
    return nn(new GraphQLList(ty) as GraphQLList<T>);
}

export const IntTy = wr(nn(GraphQLInt));
export const FloatTy = wr(nn(GraphQLFloat));
export const StrTy = wr(nn(GraphQLString));
export const BoolTy = wr(nn(GraphQLBoolean));
export const DateTimeTy = wr(nn(GraphQLDateTime));
export const DateTy = wr(nn(GraphQLDate));

export function listTy<T extends GraphQLType>(ty: Wr<T>): Wr<GraphQLNonNull<GraphQLList<T>>> {
    return wr(list(ty.type));
}

export function nullTy<T extends GraphQLNullableType>(ty: Wr<GraphQLNonNull<T>>) {
    return wr(ty.type.ofType);
}
