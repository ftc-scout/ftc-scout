import { NonEmptyArray } from "type-graphql";
import { TeamResolver } from "./resolvers/TeamResolver";
import { AwardResolver } from "./resolvers/AwardResolver";
import { registerEnums } from "./types/enums";
import { EventResolver } from "./resolvers/EventResolver";

registerEnums();
export const typeGQLResolvers: NonEmptyArray<Function> = [
    TeamResolver,
    EventResolver,
    AwardResolver,
];
