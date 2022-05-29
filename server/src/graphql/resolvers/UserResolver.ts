import { hash } from "argon2";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { User } from "../../db/entities/User";
import { checkPasswordRequirements } from "../../logic/requirements/password-requirements";
import { checkUsernameRequirements } from "../../logic/requirements/username-requirements";
import { FieldError } from "../objects/FieldError";
import { PG_UNIQUE_VIOLATION } from "../../db/postgres-error-codes";
import { isQueryFailedError } from "../../db/is-query-failed-error";

@ObjectType()
class UserErrorResponse {
    @Field(() => [FieldError], { nullable: true })
    errors: FieldError[] | undefined;

    @Field(() => User, { nullable: true })
    user: User | undefined;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserErrorResponse)
    async register(
        @Arg("username") username: string,
        @Arg("password") password: string
    ): Promise<UserErrorResponse> {
        const usernameErrors = checkUsernameRequirements(username);
        const passwordErrors = checkPasswordRequirements(password);

        if (usernameErrors.length || passwordErrors.length) {
            return {
                errors: [...usernameErrors, ...passwordErrors],
                user: undefined,
            };
        } else {
            try {
                const hashedPassword = await hash(password);
                const user = await User.create({
                    username,
                    password: hashedPassword,
                }).save();

                return {
                    errors: undefined,
                    user,
                };
            } catch (err) {
                if (
                    isQueryFailedError(err) &&
                    err.code === PG_UNIQUE_VIOLATION
                ) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "That username already exists.",
                            },
                        ],
                        user: undefined,
                    };
                }
                throw err;
            }
        }
    }
}
