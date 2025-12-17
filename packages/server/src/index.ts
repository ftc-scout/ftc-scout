import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { initDynamicEntities } from "./db/entities/dyn/init";
import express, { text } from "express";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import { apiLoggerMiddleware } from "./db/entities/ApiReq";
import { SERVER_PORT, SESSION_SECRET, SYNC_API } from "./constants";
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
import { User } from "./db/entities/User";
import { GQLContext } from "./graphql/context";

declare module "express-session" {
    interface SessionData {
        userId?: number;
    }
}

async function main() {
    await DATA_SOURCE.initialize();
    initDynamicEntities();

    let app = express();

    app.use(
        // Allow requests from our webpage.
        cors({
            // origin: "*",
            origin: true,
            credentials: true,
        }),
        compression(),
        express.json(),
        session({
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // Set to true in production with HTTPS
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            },
        })
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

    app.use(
        "/graphql",
        apiLoggerMiddleware,
        expressMiddleware(apolloServer, {
            context: async ({ req }): Promise<GQLContext> => {
                let user: User | undefined;
                if (req.session.userId) {
                    user = (await User.findOne({ where: { id: req.session.userId } })) || undefined;
                }
                return { user, req };
            },
        })
    );

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
