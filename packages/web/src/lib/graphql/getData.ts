import { browser } from "$app/environment";
import type {
    ApolloClient,
    ApolloQueryResult,
    NormalizedCacheObject,
    OperationVariables,
} from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { writable, type Readable, type Writable, readable } from "svelte/store";

let cache: Record<string, ApolloQueryResult<any>> = {};

export async function getData<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null
): Promise<Readable<ApolloQueryResult<Data> | null>> {
    let keyWithVars = bypassCacheKey + "-" + JSON.stringify(variables);
    if (bypassCacheKey && cache[keyWithVars]) {
        return readable(cache[keyWithVars]);
    }

    let queryResult = client.query({
        query,
        variables,
        // No caching if on server or if bypassing apollo cache
        fetchPolicy: browser && !bypassCacheKey ? "cache-first" : "no-cache",
    });

    let result: Writable<ApolloQueryResult<Data> | null> = writable(null);

    queryResult.then((r) => {
        result.set(r);
        if (bypassCacheKey) cache[keyWithVars] = r;
    });

    if (!browser) {
        // We are doing SSR so we must have the data.
        await queryResult;
    } else {
        // wait up to 300ms
        await Promise.race([queryResult, new Promise((r) => setTimeout(r, 300))]);
    }

    return result;
}

export function getDataSync<Data = any, Variables extends OperationVariables = object>(
    client: ApolloClient<NormalizedCacheObject> | null,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables,
    bypassCacheKey: string | null = null
): Readable<ApolloQueryResult<Data> | null> {
    let keyWithVars = bypassCacheKey + "-" + JSON.stringify(variables);
    if (bypassCacheKey && cache[keyWithVars]) {
        return readable(cache[keyWithVars]);
    }

    if (!client) return readable(null);

    let queryResult = client.query({
        query,
        variables,
        // No caching if on server or if bypassing apollo cache
        fetchPolicy: browser && !bypassCacheKey ? "cache-first" : "no-cache",
    });

    let result: Writable<ApolloQueryResult<Data> | null> = writable(null);

    queryResult.then((r) => {
        result.set(r);
        if (bypassCacheKey) cache[keyWithVars] = r;
    });

    return result;
}
