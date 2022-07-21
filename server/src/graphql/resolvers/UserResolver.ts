import { hash, verify } from "argon2";
import { Arg, Ctx, Field, MaybePromise, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../../db/entities/User";
import { checkPasswordRequirements } from "../../logic/requirements/password-requirements";
import { checkUsernameRequirements } from "../../logic/requirements/username-requirements";
import { FieldError } from "../objects/FieldError";
import { PG_UNIQUE_VIOLATION } from "../../db/postgres-error-codes";
import { isQueryFailedError } from "../../db/is-query-failed-error";
import { GraphQLContext } from "../Context";
import { checkTeamNumberRequirements } from "../../logic/requirements/team-number-requirements";

@ObjectType()
class UserErrorResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: GraphQLContext): MaybePromise<User | null> {
        if (!req.session.userId) {
            return null;
        }

        return User.findOneBy({ id: req.session.userId });
    }

    @Mutation(() => UserErrorResponse)
    async register(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Arg("teamNumber") teamNumber: string,
        @Ctx() { req }: GraphQLContext
    ): Promise<UserErrorResponse> {
        username = username.trim();

        const usernameErrors = checkUsernameRequirements(username);
        const passwordErrors = checkPasswordRequirements(password);
        const teamNumberErrors = await checkTeamNumberRequirements(teamNumber);

        if (usernameErrors.length || passwordErrors.length || teamNumberErrors.length) {
            return {
                errors: [...usernameErrors, ...passwordErrors, ...teamNumberErrors],
            };
        } else {
            try {
                const hashedPassword = await hash(password);
                const user = await User.create({
                    username,
                    password: hashedPassword,
                    teamId: teamNumber === "" ? null : +teamNumber,
                }).save();

                // Logs the user in
                req.session.userId = user.id;

                return { user };
            } catch (err) {
                if (isQueryFailedError(err) && err.code === PG_UNIQUE_VIOLATION) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "That username already exists.",
                            },
                        ],
                    };
                }
                throw err;
            }
        }
    }

    @Mutation(() => UserErrorResponse)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { req }: GraphQLContext
    ): Promise<UserErrorResponse> {
        username = username.trim();

        const user = await User.findOneBy({ username });

        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "That username does not exist.",
                    },
                ],
            };
        }

        const isCorrectPassword = await verify(user.password, password);

        if (!isCorrectPassword) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password.",
                    },
                ],
            };
        }

        // Log in the user
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req }: GraphQLContext) {
        // Log the user out
        req.session.userId = undefined;
        return true;
    }
}
