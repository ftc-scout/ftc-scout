import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { initDynamicEntities } from "./db/entities/dyn/init";
import express, { text } from "express";
import cors from "cors";
import compression from "compression";
import { apiLoggerMiddleware } from "./db/entities/ApiReq";
import { SERVER_PORT, SYNC_API } from "./constants";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GQL_SCHEMA } from "./graphql/schema";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";
import { setupBannerRoutes } from "./banner";
import { handleAnalytics } from "./analytics";
import { setupRest } from "./rest/setupRest";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { setupSiteMap } from "./sitemap/setupSitemap";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";

async function main() {
    await DATA_SOURCE.initialize();
    initDynamicEntities();

    let app = express();

    app.use(
        // Allow requests from our webpage.
        cors({
            // origin: "*",
            origin: true,
            credentials: false,
        }),
        compression(),
        express.json()
    );

    let httpServer = createServer(app);
    let wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });

    const serverCleanup = useServer({ schema: GQL_SCHEMA }, wsServer);

    let apolloServer = new ApolloServer({
        introspection: true,
        schema: GQL_SCHEMA,
        cache: new InMemoryLRUCache({
            maxSize: Math.pow(2, 20) * 100, // ~100MiB
            ttl: 120, // 2 minutes
        }),
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await apolloServer.start();

    app.use("/graphql", apiLoggerMiddleware, expressMiddleware(apolloServer));

    app.post("/analytics", text(), handleAnalytics);

    setupRest(app);
    setupSiteMap(app);

    setupBannerRoutes(app);

    httpServer.listen(SERVER_PORT, () => {
        console.info(`Server started and listening on port ${SERVER_PORT}.`);
    });

    if (SYNC_API) {
        await fetchPriorSeasons();
        await watchApi();
    }
}

main();
