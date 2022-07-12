import { DATABASE_URL, LOGGING, SYNC } from "../constants";
import { createConnection, DataSource, DataSourceOptions } from "typeorm";
import { entities } from "./entities";

const config: DataSourceOptions = {
    type: "postgres",
    url: DATABASE_URL,
    synchronize: SYNC,
    logging: LOGGING,
    entities,
};

export const FTCSDataSource = new DataSource(config);
createConnection(config);
