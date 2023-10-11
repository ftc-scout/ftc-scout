import { calculateTeamEventStats, DESCRIPTORS, type Season } from "@ftc-scout/common";
import {
    NewMatchesDocument,
    type EventPageQuery,
    type NewMatchesSubscription,
    FullMatchFragmentDoc,
    FullEventMatchesFragmentDoc,
    InsertTepFragmentDoc,
} from "../../../../../lib/graphql/generated/graphql-operations";
import { getClient } from "../../../../../lib/graphql/client";
import { browser } from "$app/environment";
import type { FetchResult, InMemoryCache } from "@apollo/client";
import type { Subscription } from "zen-observable-ts";

export let ongoingEvents = new Set<string>();
export let currentlyWatchedEvent: { season: Season; code: string } | null = null;
let subscription: Subscription | null = null;
let refresh: (() => void) | null = null;

export function watchEvent(event: NonNullable<EventPageQuery["eventByCode"]>, r: () => void) {
    if (!browser) return;

    let key = { season: event.season as Season, code: event.code };
    let keyStr = JSON.stringify(key);

    if (!event.ongoing) {
        ongoingEvents.delete(keyStr);
        return;
    }

    ongoingEvents.add(keyStr);
    currentlyWatchedEvent = key;
    refresh = r;

    subscription?.unsubscribe();
    subscription = getClient()
        .subscribe({
            query: NewMatchesDocument,
            variables: { season: event.season, code: event.code },
        })
        .subscribe(updateCache);
}

export function unsubscribe() {
    currentlyWatchedEvent = null;
    refresh = null;
    subscription?.unsubscribe();
}

function updateCache(result: FetchResult<NewMatchesSubscription>) {
    let matches = result.data?.newMatches;
    if (!matches) return;

    let cache = getClient().cache as InMemoryCache;

    let newMatchRefs = matches.map((m) =>
        cache.writeFragment({ data: m, fragment: FullMatchFragmentDoc, fragmentName: "FullMatch" })
    );

    let season = matches[0].season as Season;
    let code = matches[0].eventCode;

    let eventId = cache.identify({
        __typename: "Event",
        season,
        code,
    })!;

    cache.modify({
        id: eventId,
        fields: {
            matches: (current = []) => {
                let unique = [
                    ...new Set([
                        ...current.map((c: any) => c.__ref),
                        ...newMatchRefs.map((c) => c?.__ref),
                    ]),
                ].map((c) => ({ __ref: c }));
                return unique;
            },
        },
    });

    // Now we want to recompute stats.

    let matchData = cache.readFragment({
        id: eventId,
        fragment: FullEventMatchesFragmentDoc,
        fragmentName: "FullEventMatches",
    })!;

    let teams = matchData.matches.flatMap((m) => m.teams.map((t) => t.teamNumber));

    let scoredMatches = matchData.matches.filter((m) => m.scores);

    let stats = calculateTeamEventStats(
        matches[0].season as Season,
        matches[0].eventCode,
        false,
        scoredMatches as any,
        teams
    );

    let __typenameStats = `TeamEventStats${season}${DESCRIPTORS[season].typeSuffix(false)}`;
    let __typenameGroup = __typenameStats + "Group";
    let newTepRefs = stats.map((s) => {
        let data = {
            __typename: "TeamEventParticipation",
            season: s.season,
            eventCode: s.eventCode,
            teamNumber: s.teamNumber,
            stats: {
                __typename: __typenameStats,
                ...s,
                tot: { __typename: __typenameGroup, ...s.tot },
                avg: { __typename: __typenameGroup, ...s.avg },
                min: { __typename: __typenameGroup, ...s.min },
                max: { __typename: __typenameGroup, ...s.max },
                dev: { __typename: __typenameGroup, ...s.dev },
                opr: { __typename: __typenameGroup, ...s.opr },
            },
        } as any;
        return cache.writeFragment({
            data,
            fragment: InsertTepFragmentDoc,
            fragmentName: "InsertTep",
        });
    });

    cache.modify({
        id: eventId,
        fields: {
            teams: () => {
                return newTepRefs;
            },
        },
    });

    if (refresh) refresh();
}
