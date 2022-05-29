import { Client, createClient } from "@urql/svelte";
import { SERVER_ORIGIN } from "../constants";

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * Analagous to urql's `createClient`. Creates a client using the given fetch function
 * and all the correct settings.
 */
export function customCreateClient(fetch: Fetch): Client {
    return createClient({
        url: SERVER_ORIGIN,
        fetch,
        fetchOptions: {
            credentials: "include",
        },
    });
}
