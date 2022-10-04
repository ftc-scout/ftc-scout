import {
    HttpLink,
    InMemoryCache,
    ApolloClient,
    type HttpOptions,
    type NormalizedCacheObject,
} from "@apollo/client/core";
import { IS_DEV, SERVER_ORIGIN } from "../constants";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined = undefined;

export function getMyClient(fetch: NonNullable<HttpOptions["fetch"]>): ApolloClient<NormalizedCacheObject> {
    if (apolloClient) return apolloClient;

    const link = new HttpLink({
        uri: SERVER_ORIGIN,
        credentials: "omit",
        headers: {
            "x-wl3": "ABC",
        },
        fetch,
    });

    const cache = new InMemoryCache({
        possibleTypes: {
            MatchScores: ["MatchScores2021Remote", "MatchScores2021Traditional", "MatchScores2019"],
            MatchScoresAlliance: [
                "MatchScores2019Alliance",
                "MatchScores2021TraditionalAlliance",
                "MatchScores2021Remote",
            ],
            TeamEventStats: ["TeamEventStats2021Traditional", "TeamEventStats2021Remote", "TeamEventStats2019"],
        },
        typePolicies: {
            Team: { keyFields: ["number"] },
            Event: { keyFields: ["season", "code"] },
            Match: { keyFields: ["season", "eventCode", "id"] },
            TeamMatchParticipation: { keyFields: ["season", "eventCode", "matchId", "teamNumber"] },
            TeamEventParticipation: {
                fields: {
                    stats: {
                        merge(existing, incoming, { mergeObjects }) {
                            return mergeObjects(existing, incoming);
                        },
                    },
                },
                keyFields: ["season", "eventCode", "teamNumber"],
            },
            Award: { keyFields: ["season", "eventCode", "awardCode", "teamNumber"] },
            SearchResults: { keyFields: ["searchText"] },
            TeamSearchResult: { keyFields: ["searchText", "highlighted"] },
            EventSearchResult: { keyFields: ["searchText", "highlighted"] },
        },
    });

    apolloClient = new ApolloClient({
        connectToDevTools: IS_DEV,
        link,
        cache,
    });

    return apolloClient;
}
