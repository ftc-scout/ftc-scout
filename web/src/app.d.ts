/// <reference types="@sveltejs/kit" />

declare global {
    declare namespace App {
        // interface Locals {}
        // interface Platform {}
        // interface Session {}
        interface Stuff {
            serverError: Writable<Readable<any | undefined>>;
        }
    }
}
