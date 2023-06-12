import { DataSource } from "typeorm";
import { DATABASE_URL, LOGGING, SYNC } from "../constants";
import { ENTITIES } from "./entities";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const DATA_SOURCE = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: SYNC,
    logging: LOGGING,
    entities: ENTITIES,
    namingStrategy: new SnakeNamingStrategy(),
});
