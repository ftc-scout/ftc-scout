import type { HandleClientError } from "@sveltejs/kit";
import { UNREACHABLE, isUnreachable } from "$lib/constants";

export const handleError: HandleClientError = ({ error }) => {
    if (isUnreachable(error)) return { message: UNREACHABLE };
    console.error(error);
    return { message: "Internal Error" };
};
