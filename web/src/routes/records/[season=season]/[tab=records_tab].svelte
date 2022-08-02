<script lang="ts" context="module">
    export const load: Load = (event) => {
        let { params, url } = event;

        if (params.tab == "teams") {
            return queryLoad("teams2021", TeamSeasonRecords2021Document, {
                skip: +(url.searchParams.get("skip") ?? "0"),
                take: +(url.searchParams.get("take") ?? "50"),
                filter: { andGroups: [] },
                order: [],
                eventTypes: EventTypes.Trad,
            })(event);
        } else if (params.tab == "matches") {
            return {};
        } else {
            throw "impossible";
        }
    };
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { ApolloQueryResult } from "@apollo/client";
    import type { Load } from "@sveltejs/kit";
    import type { Readable } from "svelte/store";
    import Card from "../../../lib/components/Card.svelte";
    import Dropdown from "../../../lib/components/Dropdown.svelte";
    import TeamSeasonRecords2021 from "../../../lib/components/season-records/TeamSeasonRecords2021.svelte";
    import TabbedCard from "../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../lib/components/WidthProvider.svelte";
    import {
        EventTypes,
        TeamSeasonRecords2021Document,
        type TeamSeasonRecords2021Query,
    } from "../../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../../lib/graphql/query-load";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../lib/icons";
    import { prettyPrintSeason } from "../../../lib/util/format/pretty-print-season";
    import type { FullTep2021Remote } from "../../../lib/util/stats/StatsRemote2021";
    import type { FullTep2021Traditional } from "../../../lib/util/stats/StatsTrad2021";

    function gotoSubPage(name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            goto(`/records/${$page.params.season}/${name.toLowerCase()}?${$page.url.searchParams ?? ""}`, {
                replaceState: true,
            });
        }
    }

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(selectedPage);

    $: season = +$page.params.season as 2021;

    export let teams2021: Readable<ApolloQueryResult<TeamSeasonRecords2021Query>>;
    let teams2021Data: (FullTep2021Traditional | FullTep2021Remote)[] | undefined;
    $: teams2021Data = !teams2021 ? undefined : ($teams2021.data.teamRecords2021.teps as any);
</script>

<svelte:head>
    <title>
        {`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTC Scout`}
    </title>
</svelte:head>

<WidthProvider width={"1250px"}>
    <Card>
        <h1>{prettyPrintSeason(season)} Season Records</h1>

        <p>Season: <Dropdown items={["2021 Freight Frenzy"]} value="2021 Freight Frenzy" /></p>
        <p>
            Event Types:&nbsp; <Dropdown
                items={["Traditional and Remote", "Traditional", "Remote"]}
                value="Traditional"
            />
        </p>
    </Card>

    <TabbedCard
        names={[
            [MATCHES_ICON, "Matches"],
            [TEAMS_ICON, "Teams"],
        ]}
        bind:selectedName={selectedPage}
    >
        <TabContent name="Matches">Matches</TabContent>

        <TabContent name="Teams">
            {#if teams2021Data}
                <TeamSeasonRecords2021 eventTypes={EventTypes.TradAndRemote} data={teams2021Data} />
            {/if}
        </TabContent>
    </TabbedCard>
</WidthProvider>
