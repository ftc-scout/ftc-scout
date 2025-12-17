import { User } from "../db/entities/User";
import { Request } from "express";

export interface GQLContext {
    user: User | undefined;
    req: Request;
}
