import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { initDynamicEntities } from "./db/entities/dyn/init";
import express from "express";
import cors from "cors";
import compression from "compression";
import { apiLoggerMiddleware } from "./db/entities/ApiReq";
import { SERVER_PORT, SYNC_API } from "./constants";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { expressMiddleware } from "@apollo/server/express4";
import { GQL_SCHEMA } from "./graphql/schema";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";

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

    app.listen(SERVER_PORT, () => {
        console.log(`Server started and listening on port ${SERVER_PORT}.`);
    });

    if (SYNC_API) {
        await fetchPriorSeasons();
        await watchApi();
    }

    // let m = await DATA_SOURCE.getRepository(Match)
    //     .createQueryBuilder("m")
    //     .leftJoinAndMapMany(
    //         "m.scores",
    //         "match_score_2022",
    //         "ms",
    //         "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id"
    //     )
    //     .where("m.event_season = :season", { season: 2022 })
    //     .andWhere("m.event_code = :code", { code: "USCALAROQ2" })
    //     .getOne();
    // console.log(m);
}

main();
