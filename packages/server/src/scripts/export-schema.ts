/**
 * Exports the schema to a file after server built, npm run server:schema [-- <file>]
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { printSchema } from "graphql";

import "../db/data-source";
import { initDynamicEntities } from "../db/entities/dyn/init";
import { GQL_SCHEMA } from "../graphql/schema";

initDynamicEntities();

let file = resolve(process.argv[2] ?? resolve(__dirname, "../../../web/schema.graphql"));
writeFileSync(file, printSchema(GQL_SCHEMA) + "\n");
console.log(`Wrote the GraphQL schema to ${file}`);

process.exit(0);
