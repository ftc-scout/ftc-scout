import { NonEmptyArray } from "type-graphql";
import { HelloWorldResolver } from "./HelloWorldResolver";

export const resolvers: NonEmptyArray<Function> = [HelloWorldResolver];
