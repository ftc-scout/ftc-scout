import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [UserResolver];
