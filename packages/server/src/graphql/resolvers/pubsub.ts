import { Season } from "@ftc-scout/common";
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export function newMatchesKey(season: Season, code: string): string {
    return `NEW_MATCHES-${season}-${code}`;
}
