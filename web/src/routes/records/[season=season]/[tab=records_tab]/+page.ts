import {
    DEFAULT_SORT_TEAM_2021,
    getStatSet2021Teams,
} from "$lib/components/season-records/TeamSeasonRecords2021.svelte";
import {
    DEFAULT_SORT_TEAM_2019,
    getStatSet2019Teams,
} from "$lib/components/season-records/TeamSeasonRecords2019.svelte";
import { SortType } from "$lib/components/SortButton.svelte";
import { getMyClient } from "$lib/graphql/client";
import {
    EventTypes,
    MatchSeasonRecords2021Document,
    Order,
    Region,
    TeamSeasonRecords2019Document,
    TeamSeasonRecords2021Document,
    type Tep2019Field,
    type Tep2019Filter,
    type Tep2019Ordering,
    type Tep2021Field,
    type Tep2021Filter,
    type Tep2021Ordering,
} from "$lib/graphql/generated/graphql-operations";
import { getData } from "$lib/graphql/query-load";
import { dateFromStr } from "$lib/util/format/pretty-print-date";
import { regionFromStr } from "$lib/util/regions";
import { emptyFilter, filterToApiFilter, simpleJsonToFilter } from "$lib/util/stats/filter";
import { findInStatSet } from "$lib/util/stats/StatSet";
import type { PageLoad } from "./$types";

export function readDateFromUrl(str: string | null): Date | null {
    if (str == null) return null;

    let date = dateFromStr(str);
    return date instanceof Date && isFinite(date.valueOf()) ? date : null;
}

export function eventTypesFromStr(str: string): EventTypes | null {
    switch (str) {
        case "Traditional":
            return EventTypes.Trad;
        case "Remote":
            return EventTypes.Remote;
        case "Traditional and Remote":
            return EventTypes.TradAndRemote;
        default:
            return null;
    }
}

export function eventTypesToStr(str: EventTypes): "Traditional" | "Remote" | "Traditional and Remote" {
    switch (str) {
        case EventTypes.Trad:
            return "Traditional";
        case EventTypes.Remote:
            return "Remote";
        default:
            return "Traditional and Remote";
    }
}

export const load: PageLoad = async ({ fetch, params, url }) => {
    if (params.season == "2021") {
        let eventTypes = eventTypesFromStr(url.searchParams.get("event-types") ?? "") ?? EventTypes.Trad;
        let region = regionFromStr(url.searchParams.get("region") ?? "All") ?? Region.All;

        let start = readDateFromUrl(url.searchParams.get("start"));
        let end = readDateFromUrl(url.searchParams.get("end"));

        let take = +(url.searchParams.get("take") ?? "50");
        let page = +(url.searchParams.get("page") ?? "1");

        if (params.tab == "teams") {
            let statSet = getStatSet2021Teams(eventTypes);

            let order: Tep2021Ordering[] = [
                {
                    field: DEFAULT_SORT_TEAM_2021.stat.apiField as Tep2021Field,
                    order: DEFAULT_SORT_TEAM_2021.type == SortType.HIGH_LOW ? Order.Desc : Order.Asc,
                },
            ];
            let sortStatIdenName = url.searchParams.get("sort") ?? null;
            if (sortStatIdenName) {
                let sortStat = findInStatSet(statSet, sortStatIdenName);
                if (sortStat) {
                    let field = sortStat.apiField;
                    let direction = url.searchParams.get("sort-dir") == "reverse" ? Order.Asc : Order.Desc;
                    order = [{ field: field as Tep2021Field, order: direction }, ...order];
                }
            }

            let filter = emptyFilter();
            let filterParam = url.searchParams.get("filter") ?? null;
            if (filterParam != null) {
                try {
                    let parsed = JSON.parse(filterParam);
                    let urlFilter = simpleJsonToFilter(parsed, statSet);
                    if (urlFilter) filter = urlFilter;
                } catch {}
            }
            let apiFilter = filterToApiFilter(filter);

            let recordsData = await getData(getMyClient(fetch), TeamSeasonRecords2021Document, {
                skip: Math.max((page - 1) * take, 0),
                take,
                filter: apiFilter as Tep2021Filter,
                order,
                eventTypes,
                region,
                start,
                end,
            });

            return {
                teams2021: recordsData,
            };
        } else if (params.tab == "matches") {
            let recordsData = await getData(getMyClient(fetch), MatchSeasonRecords2021Document, {
                skip: Math.max((page - 1) * take, 0),
                take,
                filter: null,
                order: [],
                eventTypes,
                region,
                start,
                end,
            });

            return {
                matches2021: recordsData,
            };
        } else {
            throw "impossible";
        }
    } else if (params.season == "2019") {
        if (params.tab == "teams") {
            let statSet = getStatSet2019Teams();

            let region = regionFromStr(url.searchParams.get("region") ?? "All") ?? Region.All;

            let start = readDateFromUrl(url.searchParams.get("start"));
            let end = readDateFromUrl(url.searchParams.get("end"));

            let take = +(url.searchParams.get("take") ?? "50");
            let page = +(url.searchParams.get("page") ?? "1");

            let order: Tep2019Ordering[] = [
                {
                    field: DEFAULT_SORT_TEAM_2019.stat.apiField as Tep2019Field,
                    order: DEFAULT_SORT_TEAM_2019.type == SortType.HIGH_LOW ? Order.Desc : Order.Asc,
                },
            ];
            let sortStatIdenName = url.searchParams.get("sort") ?? null;
            if (sortStatIdenName) {
                let sortStat = findInStatSet(statSet, sortStatIdenName);
                if (sortStat) {
                    let field = sortStat.apiField;
                    let direction = url.searchParams.get("sort-dir") == "reverse" ? Order.Asc : Order.Desc;
                    order = [{ field: field as Tep2019Field, order: direction }, ...order];
                }
            }

            let filter = emptyFilter();
            let filterParam = url.searchParams.get("filter") ?? null;
            if (filterParam != null) {
                try {
                    let parsed = JSON.parse(filterParam);
                    let urlFilter = simpleJsonToFilter(parsed, statSet);
                    if (urlFilter) filter = urlFilter;
                } catch {}
            }
            let apiFilter = filterToApiFilter(filter);

            let recordsData = await getData(getMyClient(fetch), TeamSeasonRecords2019Document, {
                skip: Math.max((page - 1) * take, 0),
                take,
                filter: apiFilter as Tep2019Filter,
                order,
                region,
                start,
                end,
            });

            return {
                teams2019: recordsData,
            };
        } else if (params.tab == "matches") {
            return {};
        } else {
            throw "impossible";
        }
    } else {
        throw "impossible";
    }
};
