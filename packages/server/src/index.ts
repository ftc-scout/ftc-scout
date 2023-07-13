import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";
import { initDynamicEntities } from "./db/entities/dyn/init";
import express from "express";
import cors from "cors";
import compression from "compression";
import { apiLoggerMiddleware } from "./db/entities/ApiReq";
import { SERVER_PORT } from "./constants";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { typeGQLResolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@apollo/server/express4";
import { dynTypesSchema } from "./graphql/types/dyn/dyn-types-schema";

async function main() {
    await DATA_SOURCE.initialize();
    initDynamicEntities();

    let app = express();

    app.use(
        // Allow requests from our webpage.
        cors({
            origin: "*",
            credentials: false,
        }),
        compression(),
        express.json()
    );

    let { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: typeGQLResolvers,
        validate: false,
    });

    let apolloServer = new ApolloServer({
        introspection: true,
        typeDefs: [typeDefs, dynTypesSchema],
        resolvers,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();

    app.use("/graphql", apiLoggerMiddleware, expressMiddleware(apolloServer));

    app.listen(SERVER_PORT, () => {
        console.log(`Server started and listening on port ${SERVER_PORT}.`);
    });

    await fetchPriorSeasons();
    await watchApi();
}

main();
