import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloWorldResolver {
    @Query(() => String)
    helloWorld(): string {
        return "Hello, World!";
    }

    @Query(() => String)
    greet(@Arg("name") name: string): string {
        return `Hello, ${name}`;
    }
}
