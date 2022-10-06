import "dotenv/config";

import "reflect-metadata";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import { SERVER_PORT } from "./constants";
import { resolvers } from "./graphql/resolvers/resolvers";
import { DATA_SOURCE } from "./db/data-source";
import { GraphQLContext } from "./graphql/Context";
import { setupApiWatchers } from "./ftc-api/setup-watchers";
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
import { getConnection } from "typeorm";
import compression from "compression";
import { eventBanner, teamBanner } from "./banners";
import { resolve } from "path";

async function main() {
    // TODO - This is really insecure. Look in to fixing this.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    await DATA_SOURCE.initialize();

    const app = express();

    // Allow requests from our webpage.
    app.use(
        cors({
            origin: "*",
            credentials: false,
        })
    );

    app.use(compression());

    // Initialize the apollo graphql server.
    const apolloServer = new ApolloServer({
        introspection: true,
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
            ApolloServerPluginLandingPageGraphQLPlayground(),
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

    app.get("/banners/teams/:team_num", async (req, res) => {
        if (/^\d+$/.test(req.params.team_num)) {
            await teamBanner(+req.params.team_num, res);
        } else {
            res.sendFile(resolve("src/res/banner.png"));
        }
    });

    app.get("/banners/events/:season/:code", async (req, res) => {
        if (/^\d+$/.test(req.params.season)) {
            await eventBanner(+req.params.season, req.params.code, res);
        } else {
            res.sendFile(resolve("src/res/banner.png"));
        }
    });

    // Start the server
    app.listen(SERVER_PORT, () => {
        console.log(`Server started and listening on localhost:${SERVER_PORT}.`);
    });

    setupApiWatchers();
}

main();
