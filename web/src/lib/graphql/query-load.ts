import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load, LoadEvent } from "@sveltejs/kit";
import type { OperationContext } from "@urql/svelte";
import type { DocumentNode } from "graphql";
import { derived, readable } from "svelte/store";

export function queryLoad<Data = any, Variables = object>(
    name: string,
    query: string | DocumentNode | TypedDocumentNode<Data, Variables>,
    variablesProducer?: Variables | ((event: LoadEvent) => Variables),
    contextIn?: Partial<OperationContext & { pause: boolean }>
): Load {
    return async function load(event: LoadEvent) {
        let variables =
            typeof variablesProducer === "function"
                ? (variablesProducer as (event: LoadEvent) => Variables)(event)
                : variablesProducer;
        let queryResult = await event.stuff.query!(query, variables, context);

        // Update the errors for the page
        event.stuff.serverError.set(derived(queryResult, (qr) => qr.error));

        return {
            props: {
                [name]: queryResult,
            },
        };
    };
}

export function noQueryLoad(event: LoadEvent) {
    event.stuff.serverError.set(readable(undefined));
}
