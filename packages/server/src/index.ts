import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { initDynamicEntities } from "./db/entities/dyn/init";
import express, { text } from "express";
import cors from "cors";
import compression from "compression";
import { apiLoggerMiddleware } from "./db/entities/ApiReq";
import { SERVER_PORT, SYNC_API } from "./constants";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { expressMiddleware } from "@apollo/server/express4";
import { GQL_SCHEMA } from "./graphql/schema";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";
import { setupBannerRoutes } from "./banner";
import { handleAnalytics } from "./analytics";

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

    let apolloServer = new ApolloServer({
        introspection: true,
        schema: GQL_SCHEMA,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();

    app.use("/graphql", apiLoggerMiddleware, expressMiddleware(apolloServer));

    app.post("/analytics", text(), handleAnalytics);

    setupBannerRoutes(app);

    app.listen(SERVER_PORT, () => {
        console.info(`Server started and listening on port ${SERVER_PORT}.`);
    });

    if (SYNC_API) {
        await fetchPriorSeasons();
        await watchApi();
    }
}

main();
