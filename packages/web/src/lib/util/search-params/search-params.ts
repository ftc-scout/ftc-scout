import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { writable, type Updater, type Writable, get } from "svelte/store";

// Inspired by github.com/paoloricciuti/sveltekit-search-params

export type QueryParamOpts<T> = {
    encode?: (_: T) => string | null;
    decode?: (_: string | null) => T;
    pushState?: boolean;
    killHash?: boolean;
};

function defaultEncode<T>(t: T) {
    return `${t}`;
}
function defaultDecode<T>(s: string | null): T {
    return s as T;
}

export function queryParam<T>(
    name: string,
    {
        encode = defaultEncode,
        decode = defaultDecode,
        pushState = false,
        killHash = false,
    }: QueryParamOpts<T>
): Writable<T> {
    let valStore = writable<T>(decode(null));

    let setRef = { set: (_: T) => {} };
    let pageUnsub = page.subscribe(($page) => {
        setRef.set = (val: T) => {
            let str = encode(val);
            let newQuery = new URLSearchParams($page.url.searchParams);

            if (str == null) {
                newQuery.delete(name);
            } else {
                newQuery.set(name, str);
            }

            if (browser && newQuery.toString() != $page.url.searchParams.toString()) {
                goto(`?${newQuery}${killHash ? "" : $page.url.hash}`, {
                    keepFocus: true,
                    noScroll: true,
                    replaceState: !pushState,
                });
            }

            valStore.set(val);
        };

        let param = $page.url.searchParams.get(name) ?? null;
        valStore.set(decode(param));
    });

    return {
        set: (val) => setRef.set(val),
        subscribe: (run, invalidate) => {
            let valUnsub = valStore.subscribe(run, invalidate);
            return () => {
                valUnsub();
                pageUnsub();
            };
        },
        update: (updater: Updater<T>) => {
            let currentVal = get(valStore);
            let newVal = updater(currentVal);
            setRef.set(newVal);
        },
    };
}
