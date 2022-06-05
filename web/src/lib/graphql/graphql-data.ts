// Sins have been commited...

import type { Readable } from "svelte/store";

// From https://stackoverflow.com/a/51438474/10148857
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;
type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;

// From: https://stackoverflow.com/a/53955431
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// From: https://stackoverflow.com/a/60807986/10148857
type HasSingleKey<T> = IsUnion<keyof T> extends true ? false : true;

// From https://stackoverflow.com/a/54487392/10148857
type OmitDistributive<T, K extends PropertyKey> = T extends any
    ? T extends object
        ? Id<OmitRecursively<T, K>>
        : T
    : never;
type Id<T> = {} & { [P in keyof T]: T[P] }; // Cosmetic use only makes the tooltips expad the type can be removed
type OmitRecursively<T extends any, K extends PropertyKey> = Omit<
    { [P in keyof T]: OmitDistributive<T[P], K> },
    K
>;

// Written here

type FieldNonNullable<T> = { [K in keyof T]: NonNullable<T[K]> };
type ContainsNullable<T> = T extends FieldNonNullable<T> ? false : true;

type Adjust<T> = OmitRecursively<T, "__typename">;

type Flatten<T> = ContainsNullable<T> extends true
    ? PickAndFlatten<
          Required<FieldNonNullable<T>>,
          keyof Required<FieldNonNullable<T>>
      > | null
    : PickAndFlatten<T, keyof T>;

/** The type of the data returned from a query. */
export type QueryData<T> = HasSingleKey<Adjust<T>> extends true
    ? Flatten<Adjust<T>>
    : Adjust<T>;

/** A store holding the data for a query or null if the query failed. */
export type QueryDataStore<T> = Readable<QueryData<T> | null>;
