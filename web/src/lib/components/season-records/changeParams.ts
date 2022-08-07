import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";

export function changeParam(params: Record<string, string | null>, replaceState = true) {
    if (browser) {
        let old = get(page).url;
        let oldSearchParams = old.searchParams;

        let obj: Record<string, string> = {};
        for (let [k, v] of oldSearchParams.entries()) {
            obj[k] = v;
        }
        Object.assign(obj, params);
        for (let [k, v] of Object.entries(obj)) {
            if (!v) delete obj[k];
        }

        let newSearchParams = new URLSearchParams(obj);

        goto(`?${newSearchParams.toString()}`, { replaceState });
    }
}
