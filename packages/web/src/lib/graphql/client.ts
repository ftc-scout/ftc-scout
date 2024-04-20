import { env } from "$env/dynamic/public";
import {
    HttpLink,
    ApolloClient,
    type HttpOptions,
    type NormalizedCacheObject,
    InMemoryCache,
    split,
} from "@apollo/client/core";
import { IS_DEV } from "../constants";
import { browser } from "$app/environment";
import { DESCRIPTORS_LIST } from "@ftc-scout/common";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

let client: ApolloClient<NormalizedCacheObject> | null = null;

export function getClient(
    fetch?: NonNullable<HttpOptions["fetch"]>
): ApolloClient<NormalizedCacheObject> {
    if (client) return client;
    if (!fetch) throw "First call to get client must provide fetch";

    let s = IS_DEV ? "" : "s";

    let httpLink = new HttpLink({
        uri: `http${s}://${env.PUBLIC_SERVER_ORIGIN}/graphql`,
        credentials: "omit",
        headers: { [env.PUBLIC_FRONTEND_CODE!]: "." },
        fetch: (input, init) => {
            if (!browser) console.log(input);
            if (!browser) console.log(">>> try");
            let out = fetch(input, init);
            if (!browser) console.log(">>> succeed");
            return out;
        },
    });

    let link = browser
        ? split(
              ({ query }) => {
                  let definition = getMainDefinition(query);
                  return (
                      definition.kind == "OperationDefinition" &&
                      definition.operation == "subscription"
                  );
              },
              new GraphQLWsLink(
                  createClient({
                      url: `ws${s}://${env.PUBLIC_SERVER_ORIGIN}/graphql`,
                  })
              ),
              httpLink
          )
        : httpLink;

    let cache = new InMemoryCache({
        possibleTypes: {
            TeamEventStats: DESCRIPTORS_LIST.flatMap((d) => {
                let base = `TeamEventStats${d.season}`;
                return d.hasRemote ? [base + "Trad", base + "Remote"] : [base];
            }),
            MatchScores: DESCRIPTORS_LIST.flatMap((d) => {
                let base = `MatchScores${d.season}`;
                return d.hasRemote ? [base + "Trad", base + "Remote"] : [base];
            }),
        },
        typePolicies: {
            Team: { keyFields: ["number"] },
            Event: { keyFields: ["season", "code"] },
            Match: { keyFields: ["season", "eventCode", "id"] },
            TeamMatchParticipation: {
                keyFields: ["season", "eventCode", "matchId", "station", "alliance"],
            },
            TeamEventParticipation: {
                keyFields: ["season", "eventCode", "teamNumber"],
                fields: {
                    stats: {
                        merge(existing, incoming, { mergeObjects }) {
                            return mergeObjects(existing, incoming);
                        },
                    },
                },
            },
            Award: { keyFields: ["season", "eventCode", "type", "placement", "teamNumber"] },
            Location: {
                merge(existing, incoming, { mergeObjects }) {
                    return mergeObjects(existing, incoming);
                },
            },
        },
    });

    let newClient = new ApolloClient({
        connectToDevTools: IS_DEV,
        link,
        cache,
    });

    // Don't cache the client on the server
    if (browser) {
        client = newClient;
    }

    return newClient;
}
