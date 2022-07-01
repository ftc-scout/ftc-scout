import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load, LoadEvent } from "@sveltejs/kit";
import type { DocumentNode } from "graphql";
import { readable } from "svelte/store";
import { apolloClient } from "./client";

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
        let queryResult = await apolloClient.query({
            query,
            variables,
        });

        return {
            props: {
                [name]: queryResult,
            },
        };
    };
}
