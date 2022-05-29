import { EntityManager } from "typeorm";
import { FTCSSession } from "./Session";

export type GraphQLContext = {
    man: EntityManager;
    req: Request & { session: FTCSSession };
    res: Response;
};
