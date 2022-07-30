import { browser } from "$app/env";
import type { ApolloQueryResult } from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load, LoadEvent } from "@sveltejs/kit";
import type { DocumentNode } from "graphql";
import { writable, type Writable } from "svelte/store";
import { getMyClient } from "./client";

let firstPage = true;

export function queryLoad<Data = any, Variables = object>(
    name: string,
    query: DocumentNode | TypedDocumentNode<Data, Variables>,
    variablesProducer: Variables | ((event: LoadEvent) => Variables)
): Load {
    return async function load(event: LoadEvent) {
        let variables =
            typeof variablesProducer === "function"
                ? (variablesProducer as (event: LoadEvent) => Variables)(event)
                : variablesProducer;

        let queryResult = getMyClient(event.fetch).query({
            query,
            variables,
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

        return {
            props: {
                [name]: result,
            },
        };
    };
}
