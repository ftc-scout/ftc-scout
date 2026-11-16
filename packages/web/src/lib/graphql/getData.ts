import { browser } from "$app/environment";
import { NetworkStatus } from "@apollo/client/core";
import type {
    ApolloClient,
    ApolloQueryResult,
    NormalizedCacheObject,
    OperationVariables,
} from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { writable, type Readable, readable, get } from "svelte/store";

let cache: Record<string, ApolloQueryResult<any>> = {};

const WAIT_MS = 300;

function load<Data, Variables extends OperationVariables>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null,
    noCache: boolean
) {
    let key = bypassCacheKey + "-" + JSON.stringify(variables);

    let apolloCache = browser && !bypassCacheKey && !noCache;
    let earlier: ApolloQueryResult<Data> | null = !browser
        ? null
        : bypassCacheKey
        ? cache[key] ?? null
        : apolloCache
        ? fromApolloCache(client, query, variables)
        : null;

    let result = writable<ApolloQueryResult<Data> | null>(null);
    let queryResult = client.query({
        query,
        variables,
        fetchPolicy: apolloCache ? "network-only" : "no-cache",
        context: browser ? { fetchOptions: { cache: "no-cache" } } : {},
    });
    queryResult.then((r) => {
        result.set(r);
        if (browser && bypassCacheKey) cache[key] = r;
    });
    return { result, queryResult, earlier };
}

function fromApolloCache<Data, Variables extends OperationVariables>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables
): ApolloQueryResult<Data> | null {
    try {
        let data = client.readQuery({ query, variables });
        return data ? { data, loading: false, networkStatus: NetworkStatus.ready } : null;
    } catch {
        return null;
    }
}

export async function getData<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null,
    noCache: boolean = false
): Promise<Readable<ApolloQueryResult<Data> | null>> {
    let { result, queryResult, earlier } = load(client, query, variables, bypassCacheKey, noCache);

    if (!browser) {
        // We are doing SSR so we must have the data.
        await queryResult;
    } else {
        await Promise.race([
            queryResult.catch((e) => {
                if (!earlier) throw e;
            }),
            new Promise((r) => setTimeout(r, WAIT_MS)),
        ]);
        if (earlier && get(result) == null) result.set(earlier);
    }

    return result;
}

export function getDataSync<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject> | null,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null
): Readable<ApolloQueryResult<Data> | null> {
    if (!client) return readable(null);

    let { result, earlier } = load(client, query, variables, bypassCacheKey, false);
    // Shown until the API answers.
    if (earlier) result.set(earlier);
    return result;
}
