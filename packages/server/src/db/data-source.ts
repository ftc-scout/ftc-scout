import { DataSource } from "typeorm";
import { DATABASE_URL, LOGGING, SYNC_DB, DB_TIMEOUT } from "../constants";
import { ENTITIES } from "./entities";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const DATA_SOURCE = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: SYNC_DB,
    logging: LOGGING,
    entities: ENTITIES,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
        connectionTimeoutMillis: DB_TIMEOUT,
        query_timeout: DB_TIMEOUT,
        statement_timeout: DB_TIMEOUT,
    },
});
