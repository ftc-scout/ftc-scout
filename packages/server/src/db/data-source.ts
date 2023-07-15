import { DataSource } from "typeorm";
import { DATABASE_URL, LOGGING, SYNC_DB } from "../constants";
import { ENTITIES } from "./entities";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const DATA_SOURCE = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: SYNC_DB,
    logging: LOGGING,
    entities: ENTITIES,
    namingStrategy: new SnakeNamingStrategy(),
});
