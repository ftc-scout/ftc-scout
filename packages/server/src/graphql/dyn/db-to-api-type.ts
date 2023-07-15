import { GraphQLBoolean, GraphQLInt, GraphQLOutputType } from "graphql";
import { ColumnType } from "typeorm";

export function typeormTypeToGraphQLType(ty: ColumnType): GraphQLOutputType | null {
    switch (ty) {
        case "int8":
        case "smallint":
            return GraphQLInt;
        case "bool":
            return GraphQLBoolean;
        default:
            return null;
    }
}
