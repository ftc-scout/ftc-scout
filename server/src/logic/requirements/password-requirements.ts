import { FieldError } from "src/graphql/objects/FieldError";

export function checkPasswordRequirements(password: string): FieldError[] {
    let ret = [];

    if (password.length < 8) {
        ret.push({
            field: "password",
            message: "Your password must be at least 8 characters.",
        });
    }

    return ret;
}
