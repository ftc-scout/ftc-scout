import type { ApolloServerPlugin, GraphQLRequestContext } from "@apollo/server";
import type { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { HeaderMap } from "@apollo/server";
import crypto from "crypto";

interface CacheControlHint {
    maxAge?: number;
    scope?: "PUBLIC" | "PRIVATE";
}

// Operations that should be cached with their TTL in seconds, lowercase keys for case-insensitive matching
const CACHE_CONFIG: Record<string, CacheControlHint> = {
    homepage: { maxAge: 120, scope: "PUBLIC" }, // 1 minute
    teprecords: { maxAge: 120, scope: "PUBLIC" }, // 2 minutes
    matchrecords: { maxAge: 120, scope: "PUBLIC" },
    eventbycode: { maxAge: 300, scope: "PUBLIC" }, // 5 minutes
    eventssearch: { maxAge: 300, scope: "PUBLIC" },
    activeteamscount: { maxAge: 600, scope: "PUBLIC" }, // 10 minutes
    teamsregionsearch: { maxAge: 300, scope: "PUBLIC" },
};

function generateCacheKey(
    operationName: string,
    query: string,
    variables: Record<string, any>
): string {
    const hash = crypto.createHash("sha256");
    hash.update(operationName);
    hash.update(query);
    hash.update(JSON.stringify(variables));
    return `gql:${operationName}:${hash.digest("hex")}`;
}

export function responseCachePlugin(cache: KeyValueCache): ApolloServerPlugin {
    console.log(
        "[RESPONSE CACHE PLUGIN] Initialized with cache config:",
        Object.keys(CACHE_CONFIG)
    );

    return {
        async requestDidStart() {
            let cacheKey: string | null = null;
            let operationName: string | null = null;
            let shouldCache = false;
            let ttl = 0;
            let cachedResponse: any = null;

            return {
                async didResolveOperation(requestContext: GraphQLRequestContext<any>) {
                    operationName = requestContext.operationName || null;

                    if (!operationName) {
                        return;
                    }

                    // Check cache config using lowercase for case-insensitive matching
                    const config = CACHE_CONFIG[operationName.toLowerCase()];
                    if (!config) {
                        return;
                    }

                    ttl = config.maxAge || 0;
                    shouldCache = ttl > 0;

                    if (!shouldCache) {
                        return;
                    }

                    cacheKey = generateCacheKey(
                        operationName,
                        requestContext.request.query || "",
                        requestContext.request.variables || {}
                    );

                    // Try to get cached response
                    try {
                        const cached = await cache.get(cacheKey);
                        if (cached) {
                            cachedResponse = JSON.parse(cached);
                        }
                    } catch (error) {
                        console.error(`[CACHE ERROR] ${operationName}:`, error);
                    }
                },

                async responseForOperation() {
                    if (cachedResponse) {
                        const headers = new HeaderMap();
                        headers.set("cache-control", `public, max-age=${ttl}`);
                        headers.set("x-cache", "HIT");

                        return {
                            body: {
                                kind: "single" as const,
                                singleResult: cachedResponse,
                            },
                            http: {
                                headers,
                            },
                        };
                    }
                    return null;
                },

                async willSendResponse(requestContext: GraphQLRequestContext<any>) {
                    if (!shouldCache || !cacheKey || !operationName || cachedResponse) {
                        return;
                    }

                    // Don't cache errors
                    if (
                        requestContext.response?.body?.kind === "single" &&
                        requestContext.response.body.singleResult.errors
                    ) {
                        return;
                    }

                    // Cache the successful response
                    try {
                        const responseBody =
                            requestContext.response?.body?.kind === "single"
                                ? requestContext.response.body.singleResult
                                : null;

                        if (responseBody) {
                            await cache.set(cacheKey, JSON.stringify(responseBody), { ttl });

                            // Add cache headers
                            if (requestContext.response.http?.headers) {
                                requestContext.response.http.headers.set(
                                    "cache-control",
                                    `public, max-age=${ttl}`
                                );
                                requestContext.response.http.headers.set("x-cache", "MISS");
                            }
                        }
                    } catch (error) {
                        console.error(`[CACHE SET ERROR] ${operationName}:`, error);
                    }
                },
            };
        },
    };
}
