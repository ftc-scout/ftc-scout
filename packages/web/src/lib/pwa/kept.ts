import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { writable, type Readable } from "svelte/store";
import { KeptAnswers, askedOf, sameAsked, type Asked, type Kept, type Message } from "./shown";

// Keeps track of if the last request got answered by the service-worker
export const kept = writable<Kept | null>(null);

// Queries whose data is on screen
const onScreen: Asked[] = [];

const answers = new KeptAnswers((url) => {
    let address = askedOf(url);
    return address != null && onScreen.some((asked) => sameAsked(address!, asked));
});

// bundle data refreshes, avoids flickering
let again: ReturnType<typeof setTimeout> | null = null;
function loadAgain() {
    again ??= setTimeout(() => {
        again = null;
        invalidateAll();
    }, 200);
}

let changing = false;
function shownChanged() {
    if (changing) return;
    changing = true;
    queueMicrotask(() => {
        changing = false;
        if (answers.shownChanged()) loadAgain();
        kept.set(answers.summary());
    });
}

export function whileShown<T>(store: Readable<T>, asked: Asked): Readable<T> {
    if (!browser) return store;
    return {
        subscribe(run, invalidate) {
            onScreen.push(asked);
            shownChanged();
            let stop = store.subscribe(run, invalidate);
            return () => {
                stop();
                onScreen.splice(onScreen.indexOf(asked), 1);
                shownChanged();
            };
        },
    };
}

if (browser) {
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
