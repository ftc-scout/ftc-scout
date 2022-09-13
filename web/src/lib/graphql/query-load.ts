import { browser } from "$app/env";
import type { ApolloClient, ApolloQueryResult, NormalizedCacheObject } from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { writable, type Readable, type Writable } from "svelte/store";

let firstPage = true;

export async function getData<Data = any, Variables = object>(
    client: ApolloClient<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variables: Variables
): Promise<Readable<ApolloQueryResult<Data> | null>> {
    let queryResult = client.query({
        query,
        variables,
        // No caching if on server
        ...(!browser && { fetchPolicy: "no-cache" }),
    });

    let result: Writable<ApolloQueryResult<Data> | null> = writable(null);

    queryResult.then((r) => {
        result.set(r);
    });

    // If this is the first page we already rendered so we don't want to show the loading spinners.
    // Just wait for the data.
    if (!browser || firstPage) {
        // We are doing SSR so we must have the data.
        await queryResult;
    } else {
        // wait up to 100ms
        await Promise.race([queryResult, new Promise((r) => setTimeout(r, 300))]);
    }

    firstPage = false;

    return result;
}
