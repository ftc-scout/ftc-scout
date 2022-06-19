import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    IS_DEV,
} from "../constants";
import { createConnection, DataSource, DataSourceOptions } from "typeorm";
import { entities } from "./entities";

const config: DataSourceOptions = {
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: IS_DEV,
    logging: true,
    entities,
};

export const FTCSDataSource = new DataSource(config);
createConnection(config);
