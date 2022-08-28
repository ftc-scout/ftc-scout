import { EntityManager } from "typeorm";

export type GraphQLContext = {
    man: EntityManager;
    req: Request;
    res: Response;
};
