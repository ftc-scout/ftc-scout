import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { writable, type Updater, type Writable, get, type Readable, derived } from "svelte/store";

// Inspired by github.com/paoloricciuti/sveltekit-search-params

export type EcDc<T> = {
    encode?: (_: T) => string | null;
    decode?: (_: string | null) => T;
};

export type QueryOpts = {
    pushState?: boolean;
    killHash?: boolean;
};

function defaultEncode<T>(t: T) {
    return `${t}`;
}
function defaultDecode<T>(s: string | null): T {
    return s as T;
}

let batchUrl: string | null = null;
let batchPushState = false;
let batching = false;

export function startQueryParamBatch() {
    batchUrl = null;
    batching = true;
    batchPushState = false;
}

export function commitQueryParamBatch() {
    if (browser && batchUrl && batchUrl != get(page).url.searchParams.toString()) {
        goto(batchUrl, {
            keepFocus: true,
            noScroll: true,
            replaceState: !batchPushState,
        });
    }
    batching = false;
    batchUrl = null;
}

export function queryParam<T>(
    name: string,
    {
        encode = defaultEncode,
        decode = defaultDecode,
        pushState = false,
        killHash = false,
    }: EcDc<T> & QueryOpts
): Writable<T> {
    let valStore = writable<T>(decode(null));

    let setRef = { set: (_: T) => {} };
    let pageUnsub = page.subscribe(($page) => {
        setRef.set = (val: T) => {
            let str = encode(val);
            let newQuery = new URLSearchParams(batchUrl ?? $page.url.searchParams);

            if (str == null) {
                newQuery.delete(name);
            } else {
                newQuery.set(name, str);
            }

            let url = `?${newQuery}${killHash ? "" : $page.url.hash}`;
            if (browser && !batching && newQuery.toString() != $page.url.searchParams.toString()) {
                goto(url, {
                    keepFocus: true,
                    noScroll: true,
                    replaceState: !pushState,
                });
            } else if (batching) {
                batchUrl = url;
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

export function queryParams<T>(
    params: { [k in keyof T]: EcDc<T[k]> & { urlName?: string } },
    { killHash = false, pushState = false }: QueryOpts = {}
): Writable<T> {
    let initialValue = {} as T;
    for (let k in params) {
        let decode = params[k].decode ?? defaultDecode;
        initialValue[k as keyof T] = decode(null);
    }
    let valStore = writable<T>(initialValue);

    let setRef = { set: (_: T) => {} };
    let pageUnsub = page.subscribe(($page) => {
        setRef.set = (val: T) => {
            let newQuery = new URLSearchParams(batchUrl ?? $page.url.searchParams);

            for (let k in params) {
                let encode = params[k].encode ?? defaultEncode;
                let str = encode(val[k]);

                let urlName = params[k].urlName ?? k;
                if (str == null) {
                    newQuery.delete(urlName);
                } else {
                    newQuery.set(urlName, str);
                }
            }

            let url = `?${newQuery}${killHash ? "" : $page.url.hash}`;
            if (browser && !batching && newQuery.toString() != $page.url.searchParams.toString()) {
                goto(url, {
                    keepFocus: true,
                    noScroll: true,
                    replaceState: !pushState,
                });
            } else if (batching) {
                batchUrl = url;
            }

            valStore.set(val);
        };

        let newVal = {} as T;
        for (let k in params) {
            let decode = params[k].decode ?? defaultDecode;
            let urlName = params[k].urlName ?? k;
            let urlVal = $page.url.searchParams.get(urlName) ?? null;
            newVal[k as keyof T] = decode(urlVal);
        }
        valStore.set(newVal);
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

export function queryParamUrl<T>(
    name: string,
    { encode = defaultEncode }: EcDc<T>,
    value: T
): Readable<string> {
    return derived(page, ($page) => {
        let newQuery = new URLSearchParams($page.url.searchParams);
        let str = encode(value);
        if (str == null) {
            newQuery.delete(name);
        } else {
            newQuery.set(name, str);
        }
        let queryStr = newQuery.toString();
        return queryStr != "" ? "?" + queryStr : "";
    });
}
