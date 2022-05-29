import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Load } from "@sveltejs/kit";
import type { OperationContext } from "@urql/svelte";
import type { DocumentNode } from "graphql";

// export function queryLoad<Data = any, Variables = object>(
//     propName: string,
//     query: QueryArgs<Data, Variables>
// ): Load {
//     return async ({ stuff }) => {
//         let ret = {
//             [propName]: queryStore({
//                 ...query,
//                 client: stuff.client!,
//             }),
//         };
//         console.log("(in load) running in", browser ? "browser" : "server");
//         console.log("(in load) greeting", ret["greeting"])
//         return ret;
//     };
// }

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
