import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { TeamQueries } from "./resolvers/Team";
import { EventQueries } from "./resolvers/Event";

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...TeamQueries,
        ...EventQueries,
    },
});

export const GQL_SCHEMA = new GraphQLSchema({
    query,
});
