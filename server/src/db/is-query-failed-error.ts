import { DatabaseError } from "pg-protocol";
import { QueryFailedError } from "typeorm";

export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
    err instanceof QueryFailedError;
