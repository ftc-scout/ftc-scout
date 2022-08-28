import "dotenv/config";

import "reflect-metadata";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import { SERVER_PORT, IS_DEV } from "./constants";
import { resolvers } from "./graphql/resolvers/resolvers";
import { DATA_SOURCE } from "./db/data-source";
import { GraphQLContext } from "./graphql/Context";
import { setupApiWatchers } from "./ftc-api/setup-watchers";
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
import { getConnection } from "typeorm";
import compression from "compression";

async function main() {
    // TODO - This is really insecure. Look in to fixing this.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    await DATA_SOURCE.initialize();

    const app = express();

    // Allow requests from our webpage.
    app.use(
        cors({
            origin: "*",
            credentials: true,
        })
    );

    app.use(compression());

    // Initialize the apollo graphql server.
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            validate: false,
        }),
        context: ({ req, res }: { req: Request; res: Response }): GraphQLContext => ({
            man: DATA_SOURCE.manager,
            req,
            res,
        }),
        plugins: [
            // Give us a nice graphql playground when in dev.
            IS_DEV ? ApolloServerPluginLandingPageGraphQLPlayground() : ApolloServerPluginLandingPageDisabled(),
            ApolloServerLoaderPlugin({
                typeormGetConnection: getConnection, // for use with TypeORM
            }),
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

    setupApiWatchers();
}

main();
