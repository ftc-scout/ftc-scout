import "reflect-metadata";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import { SERVER_PORT, IS_DEV, WEB_ORIGIN } from "./constants";
import { resolvers } from "./graphql/resolvers/resolvers";
import { FTCSDataSource } from "./db/data-source";

async function main() {
    await FTCSDataSource.initialize();

    const app = express();

    // Allow requests from our webpage.
    app.use(
        cors({
            origin: WEB_ORIGIN,
            credentials: true,
        })
    );

    // Intilize the apollo graphql server.
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            validate: false,
        }),
        context: () => ({}),
        plugins: [
            // Give us a nice graphql playground when in dev.
            IS_DEV
                ? ApolloServerPluginLandingPageGraphQLPlayground()
                : ApolloServerPluginLandingPageDisabled(),
        ],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    // Start the server
    app.listen(SERVER_PORT, () => {
        console.log(`Server started and listening on localhost:${SERVER_PORT}`);
    });
}

main();
