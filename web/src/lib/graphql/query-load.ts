import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load, LoadEvent } from "@sveltejs/kit";
import type { OperationContext } from "@urql/svelte";
import type { DocumentNode } from "graphql";
import { derived } from "svelte/store";

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
        return {
            props: {
                [name]: queryResult,
                [name + "Data"]: derived(queryResult, (qr) => {
                    if (!qr.data) {
                        return null;
                    } else if (
                        Object.keys(qr.data).filter((x) => x != "__typename")
                            .length == 1
                    ) {
                        return Object.assign({}, ...Object.values(qr.data));
                    } else {
                        return qr.data;
                    }
                }),
            },
        };
    };
}
