import { FieldError } from "src/graphql/objects/FieldError";

const USERNAME_REGEX = /^[a-zA-Z1-9_\-]*$/;

export function checkUsernameRequirements(username: string): FieldError[] {
    let ret = [];

    if (!USERNAME_REGEX.test(username)) {
        ret.push({
            field: "username",
            message: "Your username may not contain special characters.",
        });
    }

    if (username.length < 3) {
        ret.push({
            field: "username",
            message: "Your username must be at least 3 characters.",
        });
    }

    if (username.length > 50) {
        ret.push({
            field: "username",
            message: "Your username is too long.",
        });
    }

    return ret;
}
