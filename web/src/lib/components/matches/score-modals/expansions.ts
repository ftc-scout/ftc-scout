import { writable, type Writable } from "svelte/store";

export let trad2021Expansions: Writable<Record<string, boolean>> = writable({});
export let remote2021Expansions: Writable<Record<string, boolean>> = writable({});
