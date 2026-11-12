import { browser } from "$app/environment";
import { writable } from "svelte/store";

// Keeps track of if the last request got answered by the service-worker
export const kept = writable(false);

if (browser) {
    navigator.serviceWorker?.addEventListener("message", (e) => {
        if (e.data?.ftcscout == "kept") kept.set(true);
        else if (e.data?.ftcscout == "fresh") kept.set(false);
    });

    addEventListener("online", () => kept.set(false));
}
