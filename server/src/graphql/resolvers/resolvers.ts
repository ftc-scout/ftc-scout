import { NonEmptyArray } from "type-graphql";
import { HelloWorldResolver } from "./HelloWorldResolver";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [
    HelloWorldResolver,
    UserResolver,
];
