import { NonEmptyArray } from "type-graphql";
import { TeamResolver } from "./resolvers/TeamResolver";

export const resolvers: NonEmptyArray<Function> = [TeamResolver];
