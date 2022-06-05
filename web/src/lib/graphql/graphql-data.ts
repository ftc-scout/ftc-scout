// Sins have been commited...

import type { Readable } from "svelte/store";
import type { MeAndTeamQuery, TeamQuery } from "./generated/graphql-operations";

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
type SingleKey<T> = IsUnion<keyof T> extends true
    ? never
    : {} extends T
    ? never
    : T;

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

type Actual<T> = OmitRecursively<T, "__typename">;
type FieldNonNullable<T> = { [K in keyof T]: NonNullable<T[K]> };
type Adjust<T> = Actual<FieldNonNullable<Required<T>>>;

/** The type of the data returned from a query. */
export type QueryData<T> = SingleKey<Adjust<T>> extends true
    ? Adjust<T>
    : PickAndFlatten<Adjust<T>, keyof Adjust<T>>;

/** A store holding the data for a query or null if the query failed. */
export type QueryDataStore<T> = Readable<QueryData<T> | null>;
