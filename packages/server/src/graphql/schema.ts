import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { TeamQueries } from "./resolvers/Team";
import { EventQueries, EventSubscriptions } from "./resolvers/Event";
import { RecordQueries } from "./resolvers/records/Records";
import { HomeQueries } from "./resolvers/Home";
import { BestNameMutations, BestNameQueries } from "./resolvers/BestName";

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...TeamQueries,
        ...EventQueries,
        ...RecordQueries,
        ...HomeQueries,
        ...BestNameQueries,
    },
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...BestNameMutations,
    },
});

const subscription = new GraphQLObjectType({
    name: "Subscription",
    fields: {
        ...EventSubscriptions,
    },
});

export const GQL_SCHEMA = new GraphQLSchema({
    query,
    mutation,
    subscription,
});
