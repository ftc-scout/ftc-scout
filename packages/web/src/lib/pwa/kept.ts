import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { writable } from "svelte/store";
import { KeptAnswers, type Kept, type Message } from "./shown";

// Keeps track of if the last request got answered by the service-worker
export const kept = writable<Kept | null>(null);

const answers = new KeptAnswers();

export function navigated() {
    answers.navigated();
}

if (browser) {
    // bundle data refreshes, avoids flickering
    let again: ReturnType<typeof setTimeout> | null = null;
    let loadAgain = () => {
        again ??= setTimeout(() => {
            again = null;
            invalidateAll();
        }, 200);
    };

    navigator.serviceWorker?.addEventListener("message", (e) => {
        if (typeof e.data?.ftcscout != "string") return;
        // Loading again = getting it from the cache
        if (answers.receive(e.data as Message)) loadAgain();
        kept.set(answers.summary());
    });
    // Refetch everything when back online
    addEventListener("online", () => {
        if (answers.summary()) loadAgain();
    });
}
