<script context="module" lang="ts">
    import { EventPageDocument } from "../../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../../lib/graphql/query-load";

    export const load = queryLoad("event", EventPageDocument, ({ params }) => ({
        season: +params.season,
        code: params.code,
    }));
</script>

<script lang="ts">
    import Card from "../../../lib/components/Card.svelte";
    import {
        faCalendarAlt,
        faLocationDot,
        faGlobe,
    } from "@fortawesome/free-solid-svg-icons";
    import { prettyPrintDateRange } from "../../../lib/util/format/pretty-print-date";
    import { prettyPrintURL } from "../../../lib/util/format/pretty-print-url";
    import DataFromFirst from "../../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../../lib/components/InfoIconRow.svelte";
    import type { EventPageQuery } from "../../../lib/graphql/generated/graphql-operations";
    import MatchTable from "../../../lib/components/matches/MatchTable.svelte";
    import Loading from "../../../lib/components/Loading.svelte";
    import type { ApolloQueryResult } from "@apollo/client";

    export let event: ApolloQueryResult<EventPageQuery>;
    $: eventData = event.data?.eventByCode!;

    $: startDate = new Date(eventData?.start);
    $: endDate = new Date(eventData?.end);
</script>

<Loading store={event} width={"1250px"}>
    <Card>
        <h1>{eventData.season} {eventData.name}</h1>

        <InfoIconRow icon={faCalendarAlt}>
            {prettyPrintDateRange(startDate, endDate)}
        </InfoIconRow>

        {#if eventData.website}
            <InfoIconRow icon={faGlobe}>
                <a href={eventData.website}>
                    {prettyPrintURL(eventData.website)}
                </a>
            </InfoIconRow>
        {/if}

        <InfoIconRow icon={faLocationDot}>
            {eventData.venue}, {eventData.city}, {eventData.stateOrProvince},
            {eventData.country}
        </InfoIconRow>

        <DataFromFirst />
    </Card>
    <Card>
        <h2>Matches</h2>
        <MatchTable
            matches={eventData.matches}
            event={eventData}
            isRemote={eventData.remote}
        />
    </Card>
</Loading>
