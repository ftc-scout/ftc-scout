import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLNullableType,
    GraphQLOutputType,
    GraphQLString,
    GraphQLType,
} from "graphql";
import { DescriptorDataType } from "./descriptor";
import { makeGQLEnum } from "../../utils/gql/enum";

type Wr<T> = { type: T };
function wr<T>(t: T): Wr<T> {
    return { type: t };
}

export function nn<T extends GraphQLNullableType>(ty: T): GraphQLNonNull<T> {
    return new GraphQLNonNull(ty) as GraphQLNonNull<T>;
}
export function list<T extends GraphQLType>(ty: T): GraphQLNonNull<GraphQLList<T>> {
    return nn(new GraphQLList(ty) as GraphQLList<T>);
}

export const IntTy = wr(nn(GraphQLInt));
export const StrTy = wr(nn(GraphQLString));
export const BoolTy = wr(nn(GraphQLBoolean));

export function listTy<T extends GraphQLType>(ty: Wr<T>): Wr<GraphQLNonNull<GraphQLList<T>>> {
    return wr(list(ty.type));
}

export function nullTy<T extends GraphQLNullableType>(ty: Wr<GraphQLNonNull<T>>) {
    return wr(ty.type.ofType);
}

export const Int8DTy: DescriptorDataType = {
    typeorm: { type: "int8" },
    gql: GraphQLInt,
};

export const Int16DTy: DescriptorDataType = {
    typeorm: { type: "smallint" },
    gql: GraphQLInt,
};

export const BoolDTy: DescriptorDataType = {
    typeorm: { type: "bool" },
    gql: GraphQLBoolean,
};

export function EnumDTy(
    obj: Record<string, string>,
    name: string,
    dbName: string
): DescriptorDataType {
    return {
        typeorm: {
            type: "enum",
            enum: obj,
            enumName: dbName,
        },
        gql: makeGQLEnum(obj, name),
    };
}

export function AnyDTy(gql: GraphQLOutputType): DescriptorDataType {
    return {
        typeorm: { type: "json" },
        gql,
    };
}
