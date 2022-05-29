import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load } from "@sveltejs/kit";
import type { OperationContext } from "@urql/svelte";
import type { DocumentNode } from "graphql";

export function queryLoad<Data = any, Variables = object>(
    name: string,
    query: string | DocumentNode | TypedDocumentNode<Data, Variables>,
    variables?: Variables,
    context?: Partial<OperationContext & { pause: boolean }>
): Load {
    return async function load({ stuff }) {
        return {
            props: {
                [name]: await stuff.query!(query, variables, context),
            },
        };
    };
}
