import { DATABASE_URL, IS_DEV, LOGGING } from "../constants";
import { createConnection, DataSource, DataSourceOptions } from "typeorm";
import { entities } from "./entities";

const config: DataSourceOptions = {
    type: "postgres",
    url: DATABASE_URL,
    synchronize: IS_DEV,
    logging: LOGGING,
    entities,
};

export const FTCSDataSource = new DataSource(config);
createConnection(config);
