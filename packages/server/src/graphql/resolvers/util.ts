import DataLoader from "dataloader";
import { AnyObject } from "../../type-utils";

export function groupById<I extends AnyObject, R extends I>(
    ids: readonly I[],
    results: R[]
): R[][] {
    return ids.map((i) =>
        results.filter((r) => {
            for (let k of Object.keys(i)) {
                if (i[k] != r[k]) {
                    return false;
                }
            }

            return true;
        })
    );
}

export function findById<I extends AnyObject, R extends I>(ids: readonly I[], results: R[]): R[] {
    return ids.map(
        (i) =>
            results.find((r) => {
                for (let k of Object.keys(i)) {
                    if (i[k] != r[k]) {
                        return false;
                    }
                }

                return true;
            })!
    );
}

export function Loader<I extends AnyObject, R extends I>(create: (_: I[]) => Promise<R[]>) {
    let loader = new DataLoader<I, R>(async (ids) => findById(ids, await create(ids as R[])));

    return function (
        _target: Object,
        _key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        let og = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            let k = og.apply(this, args);
            return loader.load(k);
        };
        return descriptor;
    };
}

export function ListLoader<I extends AnyObject, R extends I>(create: (_: I[]) => Promise<R[]>) {
    let loader = new DataLoader<I, R[]>(async (ids) => groupById(ids, await create(ids as R[])));

    return function (
        _target: Object,
        _key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        let og = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            let k = og.apply(this, args);
            return loader.load(k);
        };
        return descriptor;
    };
}
