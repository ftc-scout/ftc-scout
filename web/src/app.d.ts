/// <reference types="@sveltejs/kit" />

import { Client, query } from "@urql/svelte";

declare global {
    declare namespace App {
        // interface Locals {}
        // interface Platform {}
        // interface Session {}
        interface Stuff {
            client: Client;
            query: (
                query: string | DocumentNode | TypedDocumentNode<any, any>,
                variables?: any,
                context?: Partial<OperationContext & { pause: boolean }>
            ) => Promise<OperationStore>;
        }
    }
}
