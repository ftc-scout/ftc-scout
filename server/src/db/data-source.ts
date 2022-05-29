import { DB_HOST, DB_NAME, DB_PORT, IS_DEV } from "../constants";
import { DataSource } from "typeorm";
import { entities } from "./entities";

export const FTCSDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: "postgres",
    password: "postgres",
    database: DB_NAME,
    synchronize: IS_DEV,
    logging: true,
    entities,
});
