// import type { Load } from "@sveltejs/kit";
// import type { DocumentNode } from "graphql";
// import { get, readable, writable } from "svelte/store";

// export const graphqlSetupLoad: Load = async function ({ fetch, stuff }) {
//     const client = customCreateClient(fetch);

//     let serverError = writable(readable(undefined));

//     return {
//         stuff: {
//             ...stuff,
//             client,
//             query: async (
//                 query: string | DocumentNode | TypedDocumentNode<any, any>,
//                 variables?: any,
//                 context?: Partial<OperationContext & { pause: boolean }>
//             ): Promise<OperationStore> => {
//                 const store = operationStore(query, variables, context);
//                 const result = await client
//                     .query(store.query, store.variables, store.context)
//                     .toPromise();
//                 Object.assign(get(store), result);
//                 return store;
//             },
//             serverError,
//         },
//         props: { client, serverError },
//     };
// };
