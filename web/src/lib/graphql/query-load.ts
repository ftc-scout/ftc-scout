import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load, LoadEvent } from "@sveltejs/kit";
import type { OperationContext } from "@urql/svelte";
import type { DocumentNode } from "graphql";
import { is_client } from "svelte/internal";
import { derived, readable } from "svelte/store";

export function queryLoad<Data = any, Variables = object>(
    name: string,
    query: string | DocumentNode | TypedDocumentNode<Data, Variables>,
    variablesProducer?: Variables | ((event: LoadEvent) => Variables),
    context?: Partial<OperationContext & { pause: boolean }>
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
                [name + "Data"]: derived(queryResult, getData),
            },
        };
    };
}

export function noQueryLoad(event: LoadEvent) {
    event.stuff.serverError.set(readable(undefined));
}

function getData(qr: any) {
    if (!qr.data) {
        return null;
    } else if (
        Object.keys(qr.data).filter((x) => x != "__typename").length == 1
    ) {
        let values = Object.values(qr.data);
        values = values.filter((x) => x != "__typename");
        if (!values[0]) {
            return null;
        } else {
            return Object.assign({}, ...values);
        }
    } else {
        return qr.data;
    }
}
