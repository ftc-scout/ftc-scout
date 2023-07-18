import { env } from "$env/dynamic/public";
import {
    HttpLink,
    ApolloClient,
    type HttpOptions,
    type NormalizedCacheObject,
    InMemoryCache,
} from "@apollo/client/core";
import { IS_DEV } from "../constants";

let client: ApolloClient<NormalizedCacheObject> | null = null;

export function getClient(
    fetch: NonNullable<HttpOptions["fetch"]>
): ApolloClient<NormalizedCacheObject> {
    if (client) return client;

    let link = new HttpLink({
        uri: env.PUBLIC_SERVER_ORIGIN!,
        credentials: "omit",
        headers: { [env.PUBLIC_FRONTEND_CODE!]: "." },
        fetch,
    });

    let cache = new InMemoryCache({
        possibleTypes: {
            TeamEventStats: [
                "TeamEventStats2022",
                "TeamEventStats2021Trad",
                "TeamEventStats2021Remote",
                "TeamEventStats2020Trad",
                "TeamEventStats2020Remote",
                "TeamEventStats2019",
            ],
        },
        typePolicies: {
            Team: { keyFields: ["number"] },
        },
    });

    client = new ApolloClient({
        connectToDevTools: IS_DEV,
        link,
        cache,
    });

    return client;
}
