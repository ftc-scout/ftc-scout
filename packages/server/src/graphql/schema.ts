import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { TeamQueries } from "./resolvers/Team";
import { EventQueries } from "./resolvers/Event";
import { RecordQueries } from "./resolvers/records/Records";

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...TeamQueries,
        ...EventQueries,
        ...RecordQueries,
    },
});

export const GQL_SCHEMA = new GraphQLSchema({
    query,
});
